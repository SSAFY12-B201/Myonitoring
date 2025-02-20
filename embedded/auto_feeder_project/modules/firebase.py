import os
import firebase_admin
from app import FastAPI, File, UploadFile, HTTPException
import uuid
from firebase_admin import credentials, storage

# Firebase 초기화 (앱 시작 시 한 번만 수행)
# 서비스 계정 키 파일 경로 직접 지정
service_account_path = "/home/ssaf/Desktop/cat_feeder/myonitoring-firebase-adminsdk-fbsvc-78c9791370.json"
storage_bucket = "myonitoring.firebasestorage.app"  # 실제 버킷 이름으로 변경하세요

cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred, {"storageBucket": storage_bucket})

def upload_image_to_firebase(file_path)
    """
    로컬 파일을 Firebase Storage에 업로드하는 함수
    
    Args:
        file_path (str): 업로드할 파일의 로컬 경로
        
    Returns:
        dict: 업로드된 파일 정보 (파일명, URL)
    """
    try:
        # 파일 이름 추출
        file_name = os.path.basename(file_path)
        
        # 고유한 파일명 생성
        unique_filename = f"{uuid.uuid4().hex}_{file_name}"
        
        # Firebase Storage 버킷 접근
        bucket = storage.bucket()

        # Firebase Storage에 파일 업로드
        blob = bucket.blob(unique_filename)
        
        # 파일 확장자로 content-type 추측
        content_type = None
        if file_name.lower().endswith(('.jpg', '.jpeg')):
            content_type = 'image/jpeg'
        elif file_name.lower().endswith('.png'):
            content_type = 'image/png'
        
        # 파일 업로드
        blob.upload_from_filename(
            file_path,
            content_type=content_type
        )

        # 다운로드 가능한 URL 생성
        blob.make_public()
        file_url = blob.public_url

        print(f"성공적으로 업로드됨: {file_url}")
        return {"filename": unique_filename, "url": file_url}

    except Exception as e:
        print(f"업로드 실패: {str(e)}")
        return None

# 테스트: 이미지 파일 업로드
if __name__ == "__main__":
    # 업로드할 이미지 경로
    image_path = "/home/ssaf/Desktop/cat_feeder/data/images/eye_image/img_20250220_152049_right_eye.jpg"
    
    # 업로드 실행
    result = upload_image_to_firebase(image_path)
    
    if result:
        print(f"파일 업로드 성공!")
        print(f"파일명: {result['filename']}")
        print(f"다운로드 URL: {result['url']}")
    else:
        print("파일 업로드 실패")




    