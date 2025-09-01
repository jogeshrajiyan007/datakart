import streamlit as st
import pages.login as login
import pages.register as register
import pages.dashboard as dashboard

def main():
    if "page" not in st.session_state:
        st.session_state["page"] = "Login"
    
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

if __name__ == "__main__":
    main()