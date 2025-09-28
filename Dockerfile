FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/backend

COPY requirements.txt /app/

RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt

COPY app/backend /app/backend/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]