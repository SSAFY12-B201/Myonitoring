import RPi.GPIO as GPIO
import time

# ----- 센서 핀 설정 -----
INFRARED_SENSOR_PIN = 26  # 적외선 센서 OUT 핀 (GPIO 핀 번호)
ULTRASONIC_TRIG_PIN = 20  # 초음파 센서 Trig 핀 (GPIO 핀 번호)
ULTRASONIC_ECHO_PIN = 21  # 초음파 센서 Echo 핀 (GPIO 핀 번호)

# ----- 접근 감지 설정 -----
APPROACH_DISTANCE_THRESHOLD_CM = 30.0  # 고양이 접근 거리 임계값 (cm) - 필요에 따라 조정
INFRARED_ACTIVE_STATE = GPIO.LOW  # 적외선 센서 Active 상태 (물체 감지 시 출력, HAM4311 스펙 확인)

def init():
    """접근 센서 초기화 (적외선, 초음파)"""
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(INFRARED_SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP) # 풀업 저항 활성화 (HAM4311 기본 HIGH 출력 가정)

    GPIO.setup(ULTRASONIC_TRIG_PIN, GPIO.OUT)
    GPIO.setup(ULTRASONIC_ECHO_PIN, GPIO.IN)
    GPIO.output(ULTRASONIC_TRIG_PIN, GPIO.LOW) # Trig 핀 초기화

    print("Approach Sensor 초기화 완료 (적외선, 초음파)")

def read_infrared_sensor():
    """적외선 센서 값 읽기 (물체 감지 시 True 반환, 감지 안되면 False)"""
    return GPIO.input(INFRARED_SENSOR_PIN) == INFRARED_ACTIVE_STATE

def read_ultrasonic_distance():
    """초음파 센서로 거리 측정 (cm 단위), 오류 시 None 반환"""
    try:
        GPIO.output(ULTRASONIC_TRIG_PIN, GPIO.HIGH)
        time.sleep(0.00001)
        GPIO.output(ULTRASONIC_TRIG_PIN, GPIO.LOW)

        pulse_start_time = time.time()
        pulse_end_time = time.time()

        while GPIO.input(ULTRASONIC_ECHO_PIN) == GPIO.LOW:
            pulse_start_time = time.time()
        while GPIO.input(ULTRASONIC_ECHO_PIN) == GPIO.HIGH:
            pulse_end_time = time.time()

        duration = pulse_end_time - pulse_start_time
        distance = duration * 17150  # 음속 (343m/s) 반, cm 단위
        return distance
    except Exception as e: # 초음파 센서 오류 발생 시 None 반환
        print(f"초음파 센서 오류: {e}")
        return None

def detect_cat_approach():
    """고양이 접근 감지 (적외선 + 초음파 센서 융합)"""
    infrared_detected = read_infrared_sensor()
    distance = read_ultrasonic_distance()

    if infrared_detected: # 적외선 센서에서 움직임 감지
        if distance is not None and distance <= APPROACH_DISTANCE_THRESHOLD_CM: # 초음파 센서로 근접 거리 확인
            return True  # 고양이 접근 감지
    return False # 접근 감지 안됨

def cleanup():
    """GPIO 정리 (프로그램 종료 시 호출)"""
    GPIO.cleanup()
    print("Approach Sensor GPIO 정리 완료")

if __name__ == '__main__':
    try:
        init() # 접근 센서 초기화
        print("Approach Sensor 테스트 시작 (Ctrl+C 로 종료)")

        while True:
            cat_approaching = detect_cat_approach()
            distance = read_ultrasonic_distance() # 거리 값도 함께 출력

            if cat_approaching:
                print("고양이 접근 감지!")
            else:
                print("접근 감지 안됨", end=" ") # end=" " 로 줄바꿈 없이 출력
            if distance is not None:
                print(f"(초음파 거리: {distance:.2f} cm)") # 초음파 거리 값 출력
            else:
                print("(초음파 거리: 측정 오류)")

            time.sleep(0.5) #0.5초 간격으로 하라는 뜻!

    except (KeyboardInterrupt, SystemExit):
        print("Approach Sensor 테스트 종료")
    finally:
        cleanup()