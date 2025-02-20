import time
import json
import os
from datetime import datetime
from modules.weight_sensor import LoadCell, measure_weight, detect_weight_change, process_weight_change
from modules.distance_sensor import DistanceSensor, get_scaled_proximity, sensor
from modules.check_folder import check_and_process_files
from modules.config import API_TOKEN
from modules.yolo import process_images_in_folder
from modules.doctor import analyze_eye_images_and_save_json  # 닥터 모듈 임포트
from picamera2 import Picamera2
from time import sleep

def extract_and_save_max_probs(input_json_file):
    """
    닥터 모듈이 생성한 분석 결과 JSON에서 각 질환의 최대 확률만 추출하여 저장
    
    Args:
        input_json_file: 닥터 모듈이 생성한 JSON 파일 경로
    
    Returns:
        생성된 결과 딕셔너리, 실패 시 None
    """
    try:
        # 입력 JSON 파일 읽기
        with open(input_json_file, 'r', encoding='utf-8') as f:
            analysis_data = json.load(f)
        
        # 기본 메타데이터 설정
        result = {
            "serial_number": analysis_data["serial_number"],
            "datetime": analysis_data["datetime"],
            "type": "eye",
            "data": {
                "eyes": []
            }
        }
        
        # 오늘 날짜의 최대 확률값 저장용 딕셔너리
        today = datetime.now().strftime('%Y-%m-%d')
        max_probs = {
            "blepharitis_prob": 0,
            "conjunctivitis_prob": 0,
            "corneal_sequestrum_prob": 0,
            "non_ulcerative_keratitis_prob": 0,
            "corneal_ulcer_prob": 0
        }
        
        # 각 눈의 확률 데이터 처리 및 최대값 계산
        for eye in analysis_data["data"]["eyes"]:
            # 각 질환별 확률 최대값 갱신
            for condition in max_probs.keys():
                if eye[condition] > max_probs[condition]:
                    max_probs[condition] = eye[condition]
            
            # 원본 눈 데이터 그대로 추가
            eye_data = {
                "eye_side": eye["eye_side"],
                "blepharitis_prob": eye["blepharitis_prob"],
                "conjunctivitis_prob": eye["conjunctivitis_prob"],
                "corneal_sequestrum_prob": eye["corneal_sequestrum_prob"],
                "non_ulcerative_keratitis_prob": eye["non_ulcerative_keratitis_prob"],
                "corneal_ulcer_prob": eye["corneal_ulcer_prob"],
                "image_url": eye["image_url"]
            }
            result["data"]["eyes"].append(eye_data)
        
        # 최대 확률값을 결과에 추가
        result["data"]["max_probs"] = max_probs
        
        # 결과를 저장할 파일 경로 지정
        output_file = f"data/eye_analysis/eye_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        # JSON 파일로 저장
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"눈 분석 결과가 {output_file}에 저장되었습니다.")
        print(f"오늘({today})의 각 질환 최대 확률: {max_probs}")
        return result
        
    except (FileNotFoundError, json.JSONDecodeError, KeyError) as e:
        print(f"눈 분석 결과 처리 중 오류 발생: {e}")
        return None

def main():
    # 주소 영역
    folders_to_check = ["data/intake", "data/eye_analysis"]
    request_url = "https://myonitoring.site/api/data-collection"  # 파일을 업로드할 서버 URL

    # 로드셀 초기화
    DEFAULT_SCALE = 440.0  # 보정된 SCALE 값
    loadcell = LoadCell(dout_pin=15, sck_pin=14, auto_tare=True, default_scale=DEFAULT_SCALE)
    
    # 초음파 센서 초기화
    ultrasonic_sensor = sensor    
    # 설정값
    threshold = 5.0         # 의미있는 변화로 간주할 최소 무게 차이(g)
    stable_duration = 3.0   # 안정적인 상태로 판단할 시간(초)
    extended_stable_duration = 10.0  # 장시간 안정화 감지 시간(초)
    interval = 0.5          # 측정 간격(초)
    serial_number = "SN123456"  # 기기 시리얼 번호
    
    # 카메라 관련 설정
    camera_active = False
    recording_start_time = 0
    recording_duration = 30  # 30초 녹화
    image_interval = 1.0     # 이미지 캡처 간격(초)
    last_capture_time = 0
    captured_images = []     # 캡처된 이미지 파일 목록
    
    # 이미지 저장 디렉토리 확인 및 생성
    image_dir = "data/images"
    os.makedirs(image_dir, exist_ok=True)
    
    # 눈 이미지 저장 디렉토리 확인 및 생성 (닥터 모듈의 기본값과 동일하게 설정)
    eye_image_dir = "data/images/eye_image"  # 닥터 모듈의 기본 경로와 일치
    os.makedirs(eye_image_dir, exist_ok=True)
    
    # 눈 분석 결과 저장 디렉토리 확인 및 생성
    eye_analysis_dir = "data/images/eye_image"
    os.makedirs(eye_analysis_dir, exist_ok=True)
    
    # 모델 디렉토리
    model_dir = "/home/ssaf/Desktop/cat_feeder/ai"
    
    # 데이터 저장 디렉토리 확인 및 생성
    intake_dir = "data/intake"
    os.makedirs(intake_dir, exist_ok=True)
    
    # 초기 무게 측정
    prev_weight = measure_weight(loadcell)
    print(f"초기 무게: {prev_weight}g")
    
    # 상태 변수 초기화
    is_change_detected = False
    start_weight = 0
    start_time = 0
    last_change_time = time.time()
    
    # 초음파센서 상태
    ultrasonic_sensor_active = False
    proximity_threshold = 0.5  # 50cm 이내로 판단할 근접도 값
    
    # 파일 업로드 체크 주기 설정
    upload_check_interval = 60  # 60초마다 파일 업로드 체크
    last_upload_check_time = time.time()
    
    # 눈 이미지 처리 주기 설정
    eye_processing_interval = 300  # 300초(5분)마다 눈 이미지 처리
    last_eye_processing_time = time.time()
    
    try:
        print("무게 모니터링 및 초음파 감지를 시작합니다. (종료: Ctrl+C)")
        
        while True:
            current_time = time.time()
            
            # 1. 초음파 센서로 거리 측정 (100ms 주기로)
            if int(current_time * 10) % (interval * 10) == 0:  # 100ms마다 측정
                proximity = get_scaled_proximity(ultrasonic_sensor)
                distance_cm = ultrasonic_sensor.distance * 100
                
                # 거리가 50cm 이내일 경우
                if proximity >= proximity_threshold:
                    if not ultrasonic_sensor_active:
                        print(f"대상 감지: 거리 {distance_cm:.1f}cm, 근접도: {proximity:.2f}")
                        ultrasonic_sensor_active = True
                        
                        # 카메라가 아직 활성화되지 않았으면 활성화
                        if not camera_active:
                            start_camera_recording()
                            camera_active = True
                            recording_start_time = current_time
                            last_capture_time = current_time
                            captured_images = []  # 새 녹화 시작 시 이미지 목록 초기화
                else:
                    if ultrasonic_sensor_active:
                        print(f"대상 범위 벗어남: 거리 {distance_cm:.1f}cm, 근접도: {proximity:.2f}")
                        ultrasonic_sensor_active = False
            
            # 주기적으로 이미지 캡처 (카메라 활성화 중일 때)
            if camera_active and (current_time - last_capture_time) >= image_interval:
                image_path = capture_image()
                if image_path:
                    captured_images.append(image_path)
                    print(f"이미지 캡처: {image_path} (총 {len(captured_images)}장)")
                last_capture_time = current_time
            
            # 카메라 녹화 시간 체크 및 종료
            if camera_active and (current_time - recording_start_time) >= recording_duration:
                stop_camera_recording()
                camera_active = False
                
                # 녹화 종료 후 이미지 저장 정보 출력
                if captured_images:
                    save_recording_info(captured_images, recording_start_time, current_time)
                    print(f"카메라 녹화 완료: {recording_duration}초 동안 {len(captured_images)}장 촬영")
                    
                    # 녹화가 완료되면 곧바로 눈 감지 처리 실행
                    print("촬영 이미지에서 눈 감지 처리 시작...")
                    process_images_in_folder(image_dir)
                    print("눈 감지 처리 완료")
                    
                    # 눈 이미지 분석 및 결과 저장
                    print("닥터 모듈로 눈 이미지 분석 시작...")
                    eye_result_json = os.path.join(eye_analysis_dir, "eye_analysis_result.json")
                    
                    # 닥터 모듈의 기본 경로를 사용
                    analyze_result = analyze_eye_images_and_save_json(
                        image_dir=eye_image_dir,  # 닥터 모듈의 기본 경로 사용
                        model_dir=model_dir,
                        serial_number=serial_number,
                        firebase_url=None,
                        output_file=eye_result_json,
                        debug=True
                    )
                    
                    # 분석 결과 그대로 저장 (type만 수정)
                    if analyze_result:
                        result_json = extract_and_save_max_probs(eye_result_json)
                        if result_json:
                            print("눈 분석 결과 저장 완료")
                        else:
                            print("눈 분석 결과 저장 실패")
                    
                    last_eye_processing_time = current_time
                else:
                    print("카메라 녹화 완료: 캡처된 이미지 없음")
            
            # 2. 무게 측정 및 처리
            # 현재 무게 측정 (단일 측정)
            current_weight = measure_weight(loadcell)
            
            # 무게 변화 감지
            changed, change_amount = detect_weight_change(
                prev_weight, 
                current_weight,
                threshold=threshold
            )
            
            # 변화가 감지되면 처리
            if changed:
                print(f"현재 무게: {current_weight}g (변화량: {change_amount:+.1f}g)")
                
                # 새로운 변화 시작 감지
                if not is_change_detected:
                    is_change_detected = True
                    start_time = current_time
                    start_weight = prev_weight
                    print(f"변화 감지 시작: 초기 무게 {start_weight}g")
                
                last_change_time = current_time
            
            # 변화 종료 감지 조건 1: 일정 시간 동안 안정된 상태
            # 변화 종료 감지 조건 2: 10초 이상 무게가 안정된 상태
            stable_time = current_time - last_change_time
            is_extended_stable = stable_time >= extended_stable_duration
            is_normal_stable = stable_time >= stable_duration
            
            if is_change_detected and (is_extended_stable or (is_normal_stable and not ultrasonic_sensor_active)):
                # 변화 처리 및 결과 저장
                result = process_weight_change(
                    start_weight,
                    current_weight,
                    current_time - start_time,
                    loadcell=loadcell,
                    threshold=threshold
                )
                
                # 결과에 따른 처리 - 시간을 초 단위로 표시
                duration_seconds = result['duration_minutes'] * 60 if 'duration_minutes' in result else current_time - start_time
                
                if result["event_type"] == "intake":
                    print(f"섭취 감지: {round(result['change_amount'])}g, 지속시간: {round(duration_seconds, 1)}초")
                    
                    # 무게 감소가 감지되고 안정화되었을 때 데이터 저장
                    log_data = {
                        "serial_number": serial_number,
                        "datetime": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                        "type": "intake",
                        "data": {
                            "duration": max(1, round(duration_seconds / 60)),  # 분 단위로 변환 (최소 1분)
                            "amount": abs(round(result['change_amount']))  # 그램 단위
                        }
                    }
                    
                    # JSON 형식으로 저장
                    save_data_to_file(log_data)
                    print(f"데이터 저장 완료: {json.dumps(log_data, indent=2, ensure_ascii=False)}")
                    
                elif result["event_type"] == "addition":
                    print(f"무게 추가 감지: {abs(round(result['change_amount']))}g 추가됨, 시간: {round(duration_seconds, 1)}초")
                
                is_change_detected = False
            
            # 가끔 현재 무게 출력 (디버깅용)
            elif not is_change_detected and int(current_time) % 10 == 0:
                print(f"현재 무게: {current_weight}g (안정적)")
            
            # 이전 무게 업데이트
            prev_weight = current_weight
            
            # 3. 주기적으로 파일 업로드 체크
            if (current_time - last_upload_check_time) >= upload_check_interval:
                print("파일 업로드 체크 시작...")
                for folder in folders_to_check:
                    # API 토큰이 필요한 경우 추가로 전달 (config.py에서 가져온 API_TOKEN 사용)
                    result = check_and_process_files(folder, request_url, True, API_TOKEN)  
                    # result = check_and_process_files(folder, request_url, True)  # 토큰이 필요 없는 경우
                    if result > 0:
                        print(f"{folder} 폴더의 {result}개 파일이 업로드되었습니다.")
                last_upload_check_time = current_time
            
            # 4. 주기적으로 눈 이미지 처리 (카메라가 활성화되지 않았을 때만)
            if not camera_active and (current_time - last_eye_processing_time) >= eye_processing_interval:
                print("이미지 폴더에서 눈 감지 처리 시작...")
                process_images_in_folder(image_dir)
                print("눈 감지 처리 완료")
                
                # 닥터 모듈로 눈 이미지 분석 수행
                print("닥터 모듈로 눈 이미지 분석 시작...")
                eye_result_json = os.path.join(eye_analysis_dir, "eye_analysis_result.json")
                
                # 닥터 모듈의 기본 경로를 사용
                analyze_result = analyze_eye_images_and_save_json(
                    image_dir=eye_image_dir,  # 닥터 모듈의 기본 경로 사용
                    model_dir=model_dir,
                    serial_number=serial_number,
                    firebase_url=None,
                    output_file=eye_result_json,
                    debug=True
                )
                
                # 분석 결과 그대로 저장 (type만 수정)
                if analyze_result:
                    result_json = extract_and_save_max_probs(eye_result_json)
                    if result_json:
                        print("눈 분석 결과 저장 완료")
                    else:
                        print("눈 분석 결과 저장 실패")
                
                last_eye_processing_time = current_time
            
            # 일정 간격으로 대기
            sleep(interval)
        
    except KeyboardInterrupt:
        print("\n프로그램을 종료합니다.")
    finally:
        print("종료 작업을 수행합니다...")
        if camera_active:
            stop_camera_recording()
            # 녹화가 끝나지 않았지만 종료될 경우 이미지 저장 정보 출력
            if captured_images:
                save_recording_info(captured_images, recording_start_time, time.time())
        ultrasonic_sensor.close()  # 초음파 센서 리소스 정리

def start_camera_recording():
    """카메라 녹화 시작"""
    global picam
    try:
        # 카메라 초기화
        picam = Picamera2()
        picam.configure(picam.create_still_configuration())
        picam.start()
        print("카메라 녹화 시작")
    except Exception as e:
        print(f"카메라 시작 오류: {e}")

def stop_camera_recording():
    """카메라 녹화 종료"""
    global picam
    try:
        picam.stop()
        print("카메라 녹화 종료")
    except Exception as e:
        print(f"카메라 종료 오류: {e}")

def capture_image():
    """이미지 캡처 및 저장"""
    global picam
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/images/img_{timestamp}.jpg"
        picam.capture_file(filename)
        return filename
    except Exception as e:
        print(f"이미지 캡처 오류: {e}")
        return None

def save_recording_info(image_files, start_time, end_time):
    """녹화 정보를 JSON 파일로 저장"""
    recording_info = {
        "start_time": datetime.fromtimestamp(start_time).strftime("%Y-%m-%dT%H:%M:%S"),
        "end_time": datetime.fromtimestamp(end_time).strftime("%Y-%m-%dT%H:%M:%S"),
        "duration_seconds": round(end_time - start_time, 1),
        "image_count": len(image_files),
        "images": image_files
    }
    
    # 녹화 정보 저장
    filename = f"data/images/recording_info_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(recording_info, f, indent=2, ensure_ascii=False)
        print(f"녹화 정보 저장 완료: {filename}")
    except Exception as e:
        print(f"녹화 정보 저장 오류: {e}")

def save_data_to_file(data):
    """데이터를 JSON 파일로 저장"""
    # 시리얼 번호 강제 설정
    if "serial_number" in data:
        data["serial_number"] = "SN123456"
        
    # 데이터 저장 디렉토리 확인
    os.makedirs("data/intake", exist_ok=True)
    
    # 저장할 파일 경로 지정
    filename = f"data/intake/intake_log_{datetime.now().strftime('%Y%m%d')}.json"
    
    try:
        # 기존 파일이 있으면 읽어서 추가
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                file_data = json.load(f)
                if isinstance(file_data, list):
                    file_data.append(data)
                else:
                    file_data = [file_data, data]
        except (FileNotFoundError, json.JSONDecodeError):
            file_data = [data]
            
        # 파일에 저장
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(file_data, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        print(f"데이터 저장 중 오류 발생: {e}")

if __name__ == "__main__":
    main()