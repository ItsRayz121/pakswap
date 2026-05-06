FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    paddlepaddle==2.6.1 \
    paddleocr==2.7.3 \
    fastapi==0.111.0 \
    uvicorn[standard]==0.30.1 \
    python-multipart==0.0.9 \
    Pillow==10.3.0

COPY paddleocr_server.py .

EXPOSE 8866

CMD ["uvicorn", "paddleocr_server:app", "--host", "0.0.0.0", "--port", "8866"]
