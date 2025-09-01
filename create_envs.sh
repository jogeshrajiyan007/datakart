#!/bin/bash

echo "=== Creating Python Virtual Environments ==="

# Create exploration env
python3 -m venv venv_exploration
source venv_exploration/bin/activate
pip install --upgrade pip
pip install -r requirements_exploration.txt
deactivate
echo "Exploration environment (Polars + Delta + Streamlit) created successfully."

# Create dbt env
python3 -m venv venv_dbt
source venv_dbt/bin/activate
pip install --upgrade pip
pip install -r requirements_dbt.txt
deactivate
echo "DBT environment created successfully."

# Create dagster env
python3 -m venv venv_dagster
source venv_dagster/bin/activate
pip install --upgrade pip
pip install -r requirements_dagster.txt
deactivate
echo "Dagster environment created successfully."

echo "=== All environments created! ==="
read -p "Press any key to continue..."
