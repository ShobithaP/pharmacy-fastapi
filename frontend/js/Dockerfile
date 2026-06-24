FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure logs are flushed immediately
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]FROM ubuntu:latest
LABEL authors="shobitha.p"

ENTRYPOINT ["top", "-b"]