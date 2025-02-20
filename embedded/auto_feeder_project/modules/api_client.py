import requests
import json
from config import API_URL, API_TOKEN

def send_sensor_data(serial_number: str, data_type: str, data: dict, timestamp: str):
    """
    센서 데이터를 API로 전송하는 함수.
    
    :param serial_number: 장치 시리얼 번호 (문자열)
    :param data_type: 데이터 유형 ("feeding", "intake", "eye" 중 하나)
    :param data: 데이터 내용 (딕셔너리 형식)
    :param timestamp: 데이터 수집 시간 (ISO 8601 형식 문자열)
    :return: API 응답 JSON
    """
    payload = {
        "serial_number": serial_number,
        "datetime": timestamp,
        "type": data_type,
        "data": data
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}"
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  # 응답 코드가 4xx, 5xx이면 예외 발생
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# 테스트 코드 (직접 실행할 경우만 실행되도록 설정)
if __name__ == "__main__":

    # 섭취 정보 테스트
    intake_data = {"duration": 2, "amount": 20}
    response_intake = send_sensor_data("SN123456", "intake", intake_data, "2025-02-19T12:34:56Z")
    print("Intake Response:", response_intake)

