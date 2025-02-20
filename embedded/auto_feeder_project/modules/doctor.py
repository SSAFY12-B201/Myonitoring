import os
import json
import datetime
import traceback
import tensorflow as tf
import numpy as np
from PIL import Image
import glob
import re

def analyze_eye_images_and_save_json(
    image_dir="/home/ssaf/Desktop/cat_feeder/data/eye_image",
    model_dir="/home/ssaf/Desktop/cat_feeder/ai",
    serial_number="SN123456",
    firebase_url=None,
    output_file="eye_analysis_result.json",
    debug=True
):
    """
    이미지 폴더에서 눈 이미지를 찾아 TFLite 모델로 분석하고 결과를 JSON으로 저장하는 함수
    
    Args:
        image_dir: 눈 이미지가 저장된 디렉토리 경로
        model_dir: TFLite 모델이 저장된 디렉토리 경로
        serial_number: 장치의 시리얼 번호
        firebase_url: Firebase 이미지 URL (없으면 None)
        output_file: 저장할 JSON 파일 경로
        debug: 디버그 정보 출력 여부
    
    Returns:
        생성된 JSON 데이터 (딕셔너리)
    """
    if debug:
        print(f"이미지 디렉토리: {image_dir}")
        print(f"모델 디렉토리: {model_dir}")
    
    # 최신 이미지 파일 찾기 (파일명에서 날짜 추출)
    eye_images = glob.glob(os.path.join(image_dir, "img_*.jpg"))
    if not eye_images:
        raise FileNotFoundError(f"이미지를 찾을 수 없습니다: {image_dir}")
    
    if debug:
        print(f"발견된 이미지 개수: {len(eye_images)}")
        for img in eye_images[:5]:  # 처음 5개만 출력
            print(f"  - {os.path.basename(img)}")
        if len(eye_images) > 5:
            print(f"  - ... 외 {len(eye_images)-5}개")
    
    # 파일명에서 타임스탬프 추출을 위한 패턴
    pattern = re.compile(r'img_(\d{8})_(\d{6})_(\w+)_eye\.jpg')
    
    # 이미지 파일을 날짜별로 그룹화
    image_groups = {}
    for img_path in eye_images:
        basename = os.path.basename(img_path)
        match = pattern.match(basename)
        if match:
            date, time, eye_side = match.groups()
            timestamp = f"{date}_{time}"
            if timestamp not in image_groups:
                image_groups[timestamp] = {}
            image_groups[timestamp][eye_side] = img_path
    
    # 가장 최근 타임스탬프 찾기
    if not image_groups:
        raise ValueError("유효한 이미지 파일명 형식을 찾을 수 없습니다")
    
    latest_timestamp = sorted(image_groups.keys())[-1]
    latest_images = image_groups[latest_timestamp]
    
    if debug:
        print(f"최근 타임스탬프: {latest_timestamp}")
        print(f"찾은 눈 이미지: {list(latest_images.keys())}")
    
    # datetime 객체 생성
    year = int(latest_timestamp[:4])
    month = int(latest_timestamp[4:6])
    day = int(latest_timestamp[6:8])
    hour = int(latest_timestamp[9:11])
    minute = int(latest_timestamp[11:13])
    second = int(latest_timestamp[13:15])
    
    capture_datetime = datetime.datetime(year, month, day, hour, minute, second)
    formatted_datetime = capture_datetime.strftime("%Y-%m-%dT%H:%M:%S")
    
    # TFLite 모델 로드
    tflite_models = glob.glob(os.path.join(model_dir, "*.tflite"))
    if not tflite_models:
        raise FileNotFoundError(f"TFLite 모델을 찾을 수 없습니다: {model_dir}")
    
    if debug:
        print(f"발견된 모델 개수: {len(tflite_models)}")
        for model in tflite_models:
            print(f"  - {os.path.basename(model)}")
    
    # 결과를 저장할 딕셔너리 초기화
    result = {
        "serial_number": serial_number,
        "datetime": formatted_datetime,
        "type": "eye",
        "data": {
            "eyes": []
        }
    }
    
    # 각 눈 이미지에 대해 분석 수행
    for eye_side in ["right", "left"]:
        if eye_side not in latest_images:
            print(f"경고: {eye_side} 눈 이미지를 찾을 수 없습니다")
            continue
        
        if debug:
            print(f"\n===== {eye_side} 눈 이미지 분석 시작 =====")
            
        img_path = latest_images[eye_side]
        
        # 이미지 전처리
        image = Image.open(img_path)
        image = image.resize((224, 224))  # 모델 입력 크기에 맞게 조정 (모델에 따라 변경 필요)
        
        if debug:
            print(f"이미지 로드 및 리사이즈 완료: {img_path} -> (224, 224)")
        
        # 질환 확률 저장 변수 초기화
        probs = {
            "blepharitis_prob": 0.0,
            "conjunctivitis_prob": 0.0,
            "corneal_sequestrum_prob": 0.0,
            "non_ulcerative_keratitis_prob": 0.0,
            "corneal_ulcer_prob": 0.0
        }
        
        # 각 모델에 대해 추론 수행
        for model_path in tflite_models:
            model_filename = os.path.basename(model_path)
            
            if debug:
                print(f"\n모델 로드: {model_filename}")
            
            # 인터프리터 로드
            interpreter = tf.lite.Interpreter(model_path=model_path)
            interpreter.allocate_tensors()
            
            # 입력 및 출력 텐서 가져오기
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()
            
            # 이미지 전처리 - 모델 입력 타입에 맞게 준비
            if input_details[0]['dtype'] == np.uint8:
                # UINT8 타입의 양자화된 모델인 경우
                input_scale, input_zero_point = input_details[0]['quantization']
                if debug:
                    print(f"모델 입력 타입: UINT8 (양자화), 스케일: {input_scale}, 제로 포인트: {input_zero_point}")
                
                # 이미지를 0-255 범위로 변환 후 양자화 처리
                processed_image = np.array(image, dtype=np.uint8)
                processed_image = np.expand_dims(processed_image, axis=0)  # 배치 차원 추가
            else:
                # FLOAT32 타입 모델인 경우
                if debug:
                    print(f"모델 입력 타입: FLOAT32")
                
                processed_image = np.array(image, dtype=np.float32) / 255.0  # 정규화
                processed_image = np.expand_dims(processed_image, axis=0)  # 배치 차원 추가
            
            # 입력 설정
            interpreter.set_tensor(input_details[0]['index'], processed_image)
            
            # 추론 실행
            interpreter.invoke()
            
            # 출력 텐서 가져오기 및 후처리
            output_data = interpreter.get_tensor(output_details[0]['index'])
            
            # 출력이 양자화 되어 있는지 확인하고 확률로 변환
            if output_details[0]['dtype'] == np.uint8 or output_details[0]['dtype'] == np.int8:
                # 양자화된 출력을 실수 확률로 변환
                output_scale, output_zero_point = output_details[0]['quantization']
                if debug:
                    print(f"출력 타입: 양자화 (INT8/UINT8), 스케일: {output_scale}, 제로 포인트: {output_zero_point}")
                
                # 양자화된 값을 실수로 역변환 (dequantize)
                raw_output = output_data[0][0]
                prob = (raw_output - output_zero_point) * output_scale
                
                # 시그모이드를 적용하여 0-1 범위의 확률로 변환 (모델 출력 형태에 따라 다를 수 있음)
                if prob < 0:
                    # 시그모이드 함수: 1 / (1 + exp(-x))
                    prob = 1.0 / (1.0 + np.exp(-prob))
                elif prob > 1:
                    prob = 1.0
            else:
                # 이미 확률 형태로 출력된 경우
                prob = float(output_data[0][0])
                
                # 출력이 로짓(logit)인 경우 시그모이드 적용
                if prob < 0 or prob > 1:
                    prob = 1.0 / (1.0 + np.exp(-prob))
            
            if debug:
                print(f"추론 결과 확률: {prob:.4f}")
            
            # 모델 이름에 따라 적절한 질환 확률 저장 (수정된 매핑)
            model_name_lower = model_filename.lower()
            if "각막궤양" in model_name_lower:
                probs["corneal_ulcer_prob"] = round(prob, 2)
                if debug:
                    print(f"각막궤양(corneal_ulcer) 확률: {prob:.2f}")
            elif "각막부골편" in model_name_lower:
                probs["corneal_sequestrum_prob"] = round(prob, 2)
                if debug:
                    print(f"각막부골편(corneal_sequestrum) 확률: {prob:.2f}")
            elif "결막염" in model_name_lower:
                probs["conjunctivitis_prob"] = round(prob, 2)
                if debug:
                    print(f"결막염(conjunctivitis) 확률: {prob:.2f}")
            elif "비궤양성각막염" in model_name_lower:
                probs["non_ulcerative_keratitis_prob"] = round(prob, 2)
                if debug:
                    print(f"비궤양성각막염(non_ulcerative_keratitis) 확률: {prob:.2f}")
            elif "안검염" in model_name_lower:
                probs["blepharitis_prob"] = round(prob, 2)
                if debug:
                    print(f"안검염(blepharitis) 확률: {prob:.2f}")
            else:
                if debug:
                    print(f"경고: 알 수 없는 모델 이름 - {model_filename}")
        
        # 결과 저장
        eye_result = {
            "eye_side": eye_side,
            **probs,
            "image_url": firebase_url
        }
        
        result["data"]["eyes"].append(eye_result)
        
        if debug:
            print(f"\n{eye_side} 눈 분석 결과:")
            for k, v in probs.items():
                print(f"  - {k}: {v}")
    
    # 결과를 JSON 파일로 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    if debug:
        print(f"\n분석 결과가 {output_file}에 저장되었습니다.")
        
    return result

# 사용 예시
if __name__ == "__main__":
    try:
        print("눈 이미지 분석 시작...")
        result = analyze_eye_images_and_save_json(
            image_dir="/home/ssaf/Desktop/cat_feeder/data/eye_image",
            model_dir="/home/ssaf/Desktop/cat_feeder/ai",
            serial_number="SN123456",
            firebase_url=None,
            output_file="eye_analysis_result.json",
            debug=True  # 디버그 정보 출력 활성화
        )
        print("\n===== 최종 분석 결과 =====")
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"오류 발생: {e}")
        traceback.print_exc()

