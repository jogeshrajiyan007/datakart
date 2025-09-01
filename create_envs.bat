@echo off
echo === Creating Python Virtual Environments ===

:: Create exploration env
python -m venv venv_exploration
venv_exploration\Scripts\python.exe -m pip install --upgrade pip
venv_exploration\Scripts\python.exe -m pip install -r requirements_exploration.txt
echo Exploration environment (Polars + Delta + Streamlit) created successfully.

:: Create dbt env
python -m venv venv_dbt
venv_dbt\Scripts\python.exe -m pip install --upgrade pip
venv_dbt\Scripts\python.exe -m pip install -r requirements_dbt.txt
echo DBT environment created successfully.

:: Create dagster env
python -m venv venv_dagster
venv_dagster\Scripts\python.exe -m pip install --upgrade pip
venv_dagster\Scripts\python.exe -m pip install -r requirements_dagster.txt
echo Dagster environment created successfully.

echo === All environments created! ===
pause