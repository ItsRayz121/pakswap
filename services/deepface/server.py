import io
import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from deepface import DeepFace

app = FastAPI(title="DeepFace Microservice")


class VerifyRequest(BaseModel):
    img1_base64: str  # selfie
    img2_base64: str  # CNIC photo


class VerifyResponse(BaseModel):
    verified: bool
    distance: float
    threshold: float
    model: str


def b64_to_path(b64: str, tmp_path: str) -> str:
    data = base64.b64decode(b64)
    with open(tmp_path, "wb") as f:
        f.write(data)
    return tmp_path


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/verify", response_model=VerifyResponse)
def verify_faces(req: VerifyRequest):
    try:
        path1 = b64_to_path(req.img1_base64, "/tmp/img1.jpg")
        path2 = b64_to_path(req.img2_base64, "/tmp/img2.jpg")

        result = DeepFace.verify(
            img1_path=path1,
            img2_path=path2,
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=False,
        )

        return VerifyResponse(
            verified=result["verified"],
            distance=result["distance"],
            threshold=result["threshold"],
            model="ArcFace",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
