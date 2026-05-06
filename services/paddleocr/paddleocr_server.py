import base64
import io
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from paddleocr import PaddleOCR
from PIL import Image

app = FastAPI(title="PaddleOCR Microservice")
ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)


class OcrRequest(BaseModel):
    image_base64: str


class OcrResponse(BaseModel):
    text: str
    lines: list[str]
    confidence: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ocr", response_model=OcrResponse)
def run_ocr(req: OcrRequest):
    try:
        img_data = base64.b64decode(req.image_base64)
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        img.save("/tmp/ocr_input.jpg")

        result = ocr.ocr("/tmp/ocr_input.jpg", cls=True)

        lines = []
        confidences = []
        for line in (result[0] or []):
            text, conf = line[1]
            lines.append(text)
            confidences.append(conf)

        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        full_text = "\n".join(lines)

        return OcrResponse(text=full_text, lines=lines, confidence=avg_conf)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
