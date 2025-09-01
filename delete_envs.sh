#!/bin/bash

echo "=== Deleting Virtual Environments ==="

rm -rf venv_exploration
rm -rf venv_dbt
rm -rf venv_dagster

echo "=== All environments deleted! ==="
read -p "Press any key to continue..."
