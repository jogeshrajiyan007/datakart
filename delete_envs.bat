@echo off
echo === Deleting Virtual Environments ===

rmdir /s /q venv_exploration
rmdir /s /q venv_dbt
rmdir /s /q venv_dagster

echo === All environments deleted! ===
pause