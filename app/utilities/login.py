import sys
import os
import streamlit as st
from pages.auth import check_credentials, register_user
import home
import streamlit.components.v1 as components

def app():
    st.set_page_config(page_title = "Login - Metaport", layout="wide")
    left_col, right_col = st.columns([2,1])

    with left_col:
        st.markdown(
            """
            ## Welcome to **Metaport**
            Where you can create **trustable data products**
            """
        )
    
    with right_col:
        st.markdown(
            """
            <style>
            .login-card {
                background-color:#f5f5f5;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
                max-width: 400px;
                margin: 2rem auto;
                text-align: center;
            }
            .login-input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 1rem;
            }
            .login-button {
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                font-size: 1rem;
                border: none;
                border-radius: 6px;
                background-color: #2e7d32;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }
            .login-button:hover {
                background-color: #1b5e20;
            }
            .register-link {
                margin-top: 15px;
                font-size: 0.9rem;
            }
            .register-link a{
                color: #2e7d32;
                text-decoration:none;
                font-weight: bold;
            }
            .register-link a:hover {
                text-decoration: underline;
            }
            </style>
            """,
            unsafe_allow_html=True
        )
        
        # login_html = """
        # <div class="login-card">
        #     <h3>Login to your account</h3>
        #     <form>
        #         <input type="text" id="email" placeholder="Email Address" class="login-input">
        #         <input type="password" id="password" placeholder="Password" class="login-input">
        #         <button onclick="doLogin()" class="login-button">Login</button>
        #     </form>
        #     <div class="register-link">New User? <a href="#" onclick="doRegister()">Create an account here</a>
        #     </div>
        # </div>

        # <script>
        #     function doLogin() {
        #         const email = document.getElementById("login_email").value;
        #         const password = document.getElementById("login_password").value;
        #         const newUrl = window.location.href.split("?")[0] + "?login=1&email=" +encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
        #         window.location.href = newUrl
        #     }
        #     function doRegister() {
        #         const newUrl = window.location.href.split("?")[0] + "?register=1";
        #         window.location.href = newUrl
        #     }
        # </script>
        # """

        login_html = """
        <div class="login-card">
            <h3>Login to your account</h3>
            <form method="post" action="http://localhost:5001/login" target="hidden_iframe">
                <input type="text" name="email" placeholder="Email Address" class="login-input" required>
                <input type="password" name="password" placeholder="Password" class="login-input" required>
                <button type="submit" class="login-button">Login</button>
            </form>
            <div class="register-link">New User? <a href="?register=1">Create an account here</a>
            </div>
            <iframe name="hidden_iframe" style="display:none;" id="hidden_iframe" name="hidden_iframe"></iframe>
        </div>

        <!-- hidden iframe receives the POST response from Flask -->
        <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"></iframe>

        <script>
            window.addEventListener("message", function(event) {
            try {
                var data = event.data;
                if (data && data.success === true) {
                    window.location.reload();
                } else {
                    var msg = data && data.message ? data.message : "Login failed";
                    alert(msg);
                }
            } catch (e) {
                console.error("Message handling error:", e);
            }
            }, false);
        </script>    
        
        """

        # login_html = """
        # <div class="login-card">
        #     <h3>Login to your account</h3>
        #     <form method="post" action="http://localhost:5001/login">
        #         <input type="text" name="email" placeholder="Email Address" class="login-input" required><br><br>
        #         <input type="password" name="password" placeholder="Password" class="login-input" required><br><br>
        #         <button type="submit" class="login-button">Login</button>
        #     </form>
        #     <div class="register-link">New User? <a href="?register=1">Create an account here</a>
        #     </div>
        # </div>
        
        # """

        st.markdown(login_html,unsafe_allow_html=True)

        # components.html(login_html,height=400)

        # if "login_event" not in st.session_state:
        #     st.session_state.login_event = None

        if st.session_state.get("login_error"):
            st.error(st.session_state["login_error"])

        message = st.query_params

        # if "login" in message:
        #     email = message.get("email",[""])
        #     password = message.get("password",[""])

        #     st.write('Email',email)
        #     st.write('Password',password)

        #     if check_credentials(email, password):
        #         st.session_state["user"] = email
        #         st.success("Login Successful!")
        #         home.switch_to_dashboard()
        #         st.rerun()
        #     else:
        #         st.error("Invalid Credentials")

        if "register" in message:
            home.switch_to_register()
            st.rerun()

        if st.session_state.get("authenticated"):
            home.switch_to_dashboard()
            st.rerun()

