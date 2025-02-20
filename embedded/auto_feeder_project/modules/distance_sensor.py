from gpiozero import DistanceSensor
from time import sleep

# 거리 센서 핀 설정 (트리거: 23, 에코: 24)
sensor = DistanceSensor(trigger=23, echo=24, max_distance=4.0)

def get_scaled_proximity(sensor, threshold=0.5, max_distance=2.0):
    """
    sensor: gpiozero의 DistanceSensor 객체
    threshold: 임계 거리 (m) - 이 거리 이내면 1.0 반환 (예, 0.5m 이하)
    max_distance: 최대 거리 (m) - 이 거리 이상이면 0.0 반환 (예, 2m 이상)
    
    threshold와 max_distance 사이에서는 선형 보간하여 1.0에서 0.0까지 값을 반환합니다.
    """
    distance = sensor.distance  # 단위: m
    
    if distance <= threshold:
        return 1.0
    elif distance >= max_distance:
        return 0.0
    else:
        # threshold와 max_distance 사이에서 선형 보간
        scaled = 1.0 - (distance - threshold) / (max_distance - threshold)
        return scaled

if __name__ == "__main__":
    try:
        while True:
            # 거리 측정 (cm 단위로 변환)
            distance_cm = sensor.distance * 100
            # 정규화된 근접도 값 계산 (0.0 ~ 1.0)
            proximity = get_scaled_proximity(sensor)
            
            if distance_cm <= 50:  # 50cm 이내
                print(f"거리: {distance_cm:.1f}cm, 근접도: {proximity:.2f}")
            else:
                print(f"범위 초과: {distance_cm:.1f}cm, 근접도: {proximity:.2f}")
            
            sleep(0.5)  # 0.5초마다 측정
            
    except KeyboardInterrupt:
        print("프로그램 종료")
    finally:
        sensor.close()  # 센서 리소스 정리


