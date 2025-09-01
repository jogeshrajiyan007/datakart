import sys
import os
import streamlit as st
from utilities.auth import register_user
import home

def app():
    st.set_page_config(page_title="Register - Metaport", layout = "centered")
    st.markdown(
            """
            <div style="background-color:#f9f9f9; padding:30px; border-radius:15px; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
            """,
            unsafe_allow_html=True
        )
    
    st.subheader("Create your account")

    first_name = st.text_input("First Name")
    last_name = st.text_input("Last Name")
    email = st.text_input("Email Address")
    password = st.text_input("Password", type="password")
    confirm_password = st.text_input("Confirm Password", type="password")

    if st.button("Register", use_container_width=True):
        if password != confirm_password:
            st.error("Password do not match.")
        elif not first_name or not last_name or not email or not password:
            st.error("Please fill all the fields.")
        else:
            if register_user(email,password,first_name,last_name):
                st.success("Registration successful! Please go to Login page.")
            else:
                st.error("Email already exists. Try another one.")
    
    if st.button("Back to Login", use_container_width=True):
        home.switch_to_login()
    
    st.markdown("/div", unsafe_allow_html=True)