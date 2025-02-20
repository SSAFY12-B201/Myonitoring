from gpiozero import Motor
from time import sleep

# L298N 연결 설정 (BCM 핀 번호 사용)
# L298N은 속도 제어를 위한 PWM 핀(ENA/ENB)과 방향 제어 핀(IN1-4)이 필요합니다
# 오른쪽 모터 예시: IN1=23, IN2=24, ENA=25
main_motor = Motor(forward=17, backward=18, enable=12)

# 왼쪽 모터 추가 (선택사항)
# left_motor = Motor(forward=17, backward=18, enable=27)

def control_motor(pid_output):
    """
    PID 제어기의 출력(pid_output)에 따라 모터 속도를 제어하는 함수입니다.
    pid_output: -1 ~ 1 사이의 값. 양수면 전진, 음수면 후진.
    """
    # 입력값을 -1 ~ 1 범위로 제한
    pid_output = max(min(pid_output, 1), -1)
    
    # 작은 오차 범위 내라면 모터 정지 (예: 0.05 이하)
    if abs(pid_output) < 0.05:
        main_motor.stop()
    elif pid_output > 0:
        main_motor.forward(speed=pid_output)
    else:
        main_motor.backward(speed=abs(pid_output))

# 예시 사용법:
if __name__ == '__main__':
    try:
        # 예시: 3초 동안 전진, 후진, 정지 순으로 동작
        print("전진")
        control_motor(0.7)  # 전진, 속도 0.7
        sleep(3)
        
        print("후진")
        control_motor(-0.7)  # 후진, 속도 0.7
        sleep(3)
        
        print("정지")
        control_motor(0)  # 정지
        sleep(3)
    
    finally:
        # 종료 시 모터 정지
        main_motor.stop()