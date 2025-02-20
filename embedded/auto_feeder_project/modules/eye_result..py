import os

import firebase_admin
from fastapi import FastAㅃㅉPI, File, UploadFile, HTTPException
import uuid

from firebase_admin import credentials, storage

app = FastAPI()


@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # 고유한 파일명 생성
        filename = f"{uuid.uuid4().hex}_{file.filename}"

        # Firebase 서비스 계정 키 (JSON 파일 경로)
        cred = credentials.Certificate(os.environ["FB_SERVICE_ACCOUNT_JSON"])
        firebase_admin.initialize_app(cred, {"storageBucket": os.environ["FB_STORAGE_BUCKET"]})

        bucket = storage.bucket()  # Firebase Storage 버킷 초기화

        # Firebase Storage에 파일 업로드
        blob = bucket.blob(filename)
        blob.upload_from_file(file.file, content_type=file.content_type)

        # 다운로드 가능한 URL 생성
        blob.make_public()
        file_url = blob.public_url

        return {"filename": filename, "url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
