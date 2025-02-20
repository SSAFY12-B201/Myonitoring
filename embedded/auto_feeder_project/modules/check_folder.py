import os
import json
import requests

def send_sensor_data(serial_number: str, data_type: str, data: dict, timestamp: str, api_url: str, api_token=None):
    """
    센서 데이터를 API로 전송하는 함수.
    
    :param serial_number: 장치 시리얼 번호 (문자열)
    :param data_type: 데이터 유형 ("feeding", "intake", "eye" 중 하나)
    :param data: 데이터 내용 (딕셔너리 형식)
    :param timestamp: 데이터 수집 시간 (ISO 8601 형식 문자열)
    :param api_url: API 엔드포인트 URL
    :param api_token: API 인증 토큰 (선택 사항)
    :return: API 응답 결과 딕셔너리
    """
    payload = {
        "serial_number": serial_number,
        "datetime": timestamp,
        "type": data_type,
        "data": data
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    # API 토큰이 제공된 경우 헤더에 추가
    if api_token:
        headers["Authorization"] = f"Bearer {api_token}"
    
    try:
        print(f"Sending request to: {api_url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(api_url, headers=headers, json=payload)
        
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Response raw content: {response.text}")
        
        response.raise_for_status()  # 응답 코드가 4xx, 5xx이면 예외 발생
        
        # 응답 본문이 비어있으면 상태 코드만 반환
        if not response.text.strip():
            return {"status": response.status_code, "message": "성공 (빈 응답)"}
        
        # 응답 본문이 있으면 JSON으로 파싱
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

def check_and_process_files(directory_path, api_url, delete_on_success=True, api_token=None):
    """
    디렉토리에 있는 모든 JSON 파일을 읽고 API로 전송하는 함수
    
    :param directory_path: JSON 파일이 있는 디렉토리 경로
    :param api_url: API 엔드포인트 URL
    :param delete_on_success: 성공시 파일 삭제 여부 (기본값: True)
    :param api_token: API 인증 토큰 (선택 사항)
    :return: 성공적으로 처리된 파일 수
    """
    성공_건수 = 0
    실패_건수 = 0
    
    print(f"Processing files in directory: {directory_path}")
    print(f"File deletion on success: {'Enabled' if delete_on_success else 'Disabled'}")
    
    # 디렉토리가 존재하는지 확인
    if not os.path.exists(directory_path):
        print(f"Directory does not exist: {directory_path}")
        return 0
    
    # 디렉토리 내의 모든 JSON 파일 탐색
    for filename in os.listdir(directory_path):
        if filename.endswith('.json'):
            file_path = os.path.join(directory_path, filename)
            
            try:
                # JSON 파일 읽기
                with open(file_path, 'r') as file:
                    json_data = json.load(file)
                
                print(f"Processing file: {filename}")
                print(f"Data content: {json.dumps(json_data, indent=2)}")
                
                # JSON 데이터에서 필요한 정보 추출
                serial_number = json_data.get('serial_number')
                timestamp = json_data.get('datetime')
                data_type = json_data.get('type')
                data = json_data.get('data')
                
                # API로 데이터 전송
                response = send_sensor_data(serial_number, data_type, data, timestamp, api_url, api_token)
                
                # 응답에 status 또는 error 키가 있는지 확인
                if "status" in response and response["status"] in [200, 201, 202]:
                    print(f"Successfully sent data from file: {filename}")
                    성공_건수 += 1
                    
                    # 성공시 파일 삭제 옵션이 활성화되어 있으면 파일 삭제
                    if delete_on_success:
                        os.remove(file_path)
                        print(f"Deleted file: {filename}")
                else:
                    print(f"Failed to send data from file: {filename}, Response: {response}")
                    실패_건수 += 1
                
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON in file {filename}: {e}")
                실패_건수 += 1
            except Exception as e:
                print(f"Error processing file {filename}: {e}")
                실패_건수 += 1
    
    print(f"Processing complete. Success: {성공_건수}, Failed: {실패_건수}")
    return 성공_건수