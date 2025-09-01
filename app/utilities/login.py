import sys
import os
import streamlit as st
from utilities.auth import check_credentials, register_user
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
        
        login_html = """
        <div class="login-card">
            <h3>Login to your account</h3>
            <form>
                <input type="text" id="email" placeholder="Email Address" class="login-input">
                <input type="password" id="password" placeholder="Password" class="login-input">
                <button onclick="sendLogin()" class="login-button">Login</button>
            </form>
            <div class="register-link">New User? <a href="#" onclick="sendRegister()">Create an account here</a>
            </div>
        </div>

        <script>
            function sendLogin() {
                const email = document.getElementById("login_email").value;
                const password = document.getElementById("login_password").value;
                window.parent.postMessage({type: "login", email: email, password: password}, "*");
            }
            function sendRegister() {
                window.parent.postMessage({type:"register"}, "*");
            }
        </script>
        """

        st.markdown(login_html,unsafe_allow_html=True)

        # components.html(login_html,height=400)

        # if "login_event" not in st.session_state:
        #     st.session_state.login_event = None

        # message = st.query_params

        # if "login" in message:
        #     email = message.get("email",[""])[0]
        #     password = message.get("password",[""])[0]

        #     if check_credentials(email, password):
        #         st.success("Login Successful!")
        #         home.switch_to_dashboard()
        #         st.experimental_rerun()
        #     else:
        #         st.error("Invalid Credentials")

        # elif "register" in message:
        #     home.switch_to_register()
        #     st.experimental_rerun()
