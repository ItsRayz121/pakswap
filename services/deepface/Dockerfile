FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    deepface==0.0.93 \
    fastapi==0.111.0 \
    uvicorn[standard]==0.30.1 \
    python-multipart==0.0.9 \
    opencv-python-headless==4.10.0.82 \
    tf-keras

COPY server.py .

EXPOSE 5000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5000"]
