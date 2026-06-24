FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install \
    --trusted-host pypi.org \
    --trusted-host files.pythonhosted.org \
    --upgrade pip setuptools wheel

RUN pip install \
    --trusted-host pypi.org \
    --trusted-host files.pythonhosted.org \
    --no-cache-dir \
    -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
