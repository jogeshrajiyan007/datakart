import streamlit as st
import pages.login as login
import pages.register as register
import pages.dashboard as dashboard
import threading
from flask import Flask, request, jsonify
from pages.auth import check_credentials
import json
import time

flask_app = Flask(__name__)
_login_notify = {"success":None,"email": None,"message": None}
_login_lock = threading.Lock()

@flask_app.route("/login",methods=["POST"])
def login_endpoint():
    email = request.form.get("email")
    password = request.form.get("password")

    success = check_credentials(email,password)
    msg = "Login successful" if success else "Invalid email or password."

    with _login_lock:
        _login_notify["success"] = success
        _login_notify["email"] = email if success else None
        _login_notify["message"] = None if success else msg

    payload = json.dumps({"success":success, "message":msg})
    return f"""
        <html>
            <body>
                <script>
                    // send a message to parent window (Streamlit page)
                    window.parent.postMessage({payload},"*");
                    //optional visible content:
                    document.write("Login processed. You can close this frame.");
                </script>
            </body>
        </html>

    """

    # if check_credentials(email,password):
    #     st.session_state["authenticated"]=True
    #     st.session_state["user"]=email
    #     st.session_state["page"]="Dashboard"
    #     st.session_state["login_error"] = None
    #     return jsonify({"success": True, "message":"Login successful"})
    # else:
    #     st.session_state["authenticated"]=False
    #     st.session_state["login_error"] = "Invalid email or password"
    #     return jsonify({"success":False,"message":"Invalid credentials"})

def run_flask():
    flask_app.run(port=5001, debug=False, use_reloader=False)

def _consume_login_notify():
    with _login_lock:
        notify = {
            "success": _login_notify["success"],
            "email":_login_notify["email"],
            "message":_login_notify["message"]
        }

        _login_notify["success"] = None
        _login_notify["email"] = None
        _login_notify["message"] = None
    
    if notify["success"] is None:
        return None
    return notify

def main():
    if "page" not in st.session_state:
        st.session_state["page"] = "Login"
    if "authenticated" not in st.session_state:
        st.session_state["authenticated"] = False
    if "user" not in st.session_state:
        st.session_state["user"] = None
    if "login_error" not in st.session_state:
        st.session_state["login_error"] = None

    notify = _consume_login_notify()
    if notify is not None:
        if notify["success"]:
            st.session_state["authenticated"]=True
            st.session_state["user"]=notify["email"]
            st.session_state["page"]="Dashboard"
            st.session_state["login_error"] = None
        else:
            st.session_state["authenticated"]=False
            st.session_state["user"]=None
            st.session_state["page"]="Login"
            st.session_state["login_error"] =notify["message"]

    if st.session_state["authenticated"] and st.session_state["user"]:
        st.session_state["page"] = "Dashboard" 
    
    if st.session_state["page"] == "Login":
        login.app()
    elif st.session_state["page"] == "Register":
        register.app()
    elif st.session_state["page"] == "Dashboard":
        dashboard.app()


def switch_to_login():
    st.session_state["page"] = "Login"

def switch_to_register():
    st.session_state["page"]="Register"

def switch_to_dashboard():
    st.session_state["page"]="Dashboard"

if "flask_started" not in st.session_state:
    threading.Thread(target=run_flask,daemon=True).start()
    st.session_state["flask_started"] = True

if __name__ == "__main__":
    main()
