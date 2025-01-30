import RPi.GPIO as GPIO
import time

# ----- L298N 모터 드라이버 설정 -----
IN1_PIN = 23  # L298N IN1 핀 (GPIO 핀 번호)
IN2_PIN = 24  # L298N IN2 핀 (GPIO 핀 번호)
ENA_PIN = 25  # L298N ENA 핀 (PWM 제어, GPIO 핀 번호)
PWM_FREQUENCY = 100  # PWM 주파수 (Hz)
# ----------------------------------

pwm_motor = None  # PWM 객체를 저장할 변수

def init():
    """모터 제어 초기화 (L298N 사용)"""
    global pwm_motor
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(IN1_PIN, GPIO.OUT)
    GPIO.setup(IN2_PIN, GPIO.OUT)
    GPIO.setup(ENA_PIN, GPIO.OUT)

    pwm_motor = GPIO.PWM(ENA_PIN, PWM_FREQUENCY)  # PWM 객체 생성 (ENA 핀, 주파수 설정)
    stop_motor() # 초기 상태: 모터 정지
    print("Motor Control (L298N) 초기화 완료")

def set_speed(duty_cycle):
    """모터 속도 설정 (PWM Duty Cycle 0-100%)"""
    if not (0 <= duty_cycle <= 100):
        raise ValueError("Duty Cycle은 0에서 100 사이의 값이어야 합니다.")
    pwm_motor.ChangeDutyCycle(duty_cycle) # Duty Cycle 변경
    if duty_cycle > 0:
        forward() # Duty Cycle > 0 이면 정방향 회전
    else:
        stop_motor() # Duty Cycle <= 0 이면 정지

def forward():
    """정방향 회전 (OUT1-OUT2 방향)"""
    GPIO.output(IN1_PIN, GPIO.HIGH)
    GPIO.output(IN2_PIN, GPIO.LOW)

def backward():
    """역방향 회전 (OUT2-OUT1 방향) - 필요한 경우 사용"""
    GPIO.output(IN1_PIN, GPIO.LOW)
    GPIO.output(IN2_PIN, GPIO.HIGH)

def stop_motor():
    """모터 정지 (안전하게 정지)"""
    set_speed(0) # Duty Cycle 0으로 설정 (PWM 정지)
    GPIO.output(IN1_PIN, GPIO.LOW)
    GPIO.output(IN2_PIN, GPIO.LOW)

def cleanup():
    """GPIO 정리 (프로그램 종료 시 호출)"""
    stop_motor() # 모터 정지 후 정리
    pwm_motor.stop() # PWM 정지
    GPIO.cleanup()
    print("Motor Control GPIO 정리 완료")

if __name__ == '__main__':
    try:
        init()
        print("Motor Control (L298N) 테스트 시작 (Ctrl+C로 종료)")
        pwm_motor.start(0) # PWM 시작 (Duty Cycle 0%)

        while True:
            duty_cycle_input = input("Duty Cycle (0-100): ")
            try:
                duty_cycle = float(duty_cycle_input)
                set_speed(duty_cycle)
                print("Duty Cycle 설정:", duty_cycle)
            except ValueError:
                print("잘못된 입력입니다. 숫자를 입력하세요.")

    except (KeyboardInterrupt, SystemExit):
        print("Motor Control (L298N) 테스트 종료")
    finally:
        cleanup()