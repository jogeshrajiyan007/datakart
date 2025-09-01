import sys
import os
import streamlit as st
import home

def app():
    st.set_page_config(page_title="Dashboard - Metaport", layout="wide")
    st.title("Metaport Dashboard")
    st.write(f"Welcome, **{st.session_state.get('user','Guest')}**!")

    st.markdown("---")

    if st.button("Logout", use_container_width=True):
        st.session_state["authenticated"] = False
        st.session_state["user"] = None
        home.switch_to_login()