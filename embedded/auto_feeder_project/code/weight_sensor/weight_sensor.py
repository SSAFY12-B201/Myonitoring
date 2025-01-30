import RPi.GPIO as GPIO
from hx711 import HX711
import time

# ----- 설정 값 -----
DOUT_PIN = 17  # HX711 DT 핀
CLK_PIN = 18   # HX711 SCK 핀
CALIBRATION_FACTOR = 150.0  # **수동 캘리브레이션 계수**: 실험적으로 조정해야 함! (초기값 예시)
# ------------------

hx = None
offset = 0

def init():
    """무게 센서 (HX711) 초기화 함수"""
    global hx, offset
    GPIO.setmode(GPIO.BCM)
    hx = HX711(dout_pin=DOUT_PIN, clk_pin=CLK_PIN, gain_channel_A=128)
    hx.reset()
    offset = hx.zero() # 영점 조정
    print("Weight Sensor 초기화 완료. 영점 오프셋:", offset)

def tare():
    """현재 무게를 0으로 설정 (Tare 기능)"""
    global offset
    offset = hx.zero()
    print("Tare 완료. 새로운 영점 오프셋:", offset)

def read_raw_value():
    """HX711 로부터 raw ADC 값 읽어오기"""
    return hx.get_raw_value_mean(times=5)

def read_weight():
    """무게 값 읽어오기 (그램 단위)"""
    raw_value = read_raw_value()
    weight = (raw_value - offset) / CALIBRATION_FACTOR # **고정된 캘리브레이션 계수 사용**
    return weight


### 디버깅용 코드 ###
if __name__ == '__main__':
    try:
        init()
        print("초기 캘리브레이션 계수:", CALIBRATION_FACTOR) # 설정된 캘리브레이션 계수 값 출력

        while True:
            weight = read_weight()
            print("무게: {:.2f} g".format(weight))
            time.sleep(0.5) #

    except (KeyboardInterrupt, SystemExit):
        print("Weight Sensor 테스트 종료")
    finally:
        GPIO.cleanup()
        if hx:
            hx.power_down()
            hx.cleanup()