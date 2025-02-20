import os
from gpiozero import DigitalInputDevice, DigitalOutputDevice
from time import sleep, time
import json
from datetime import datetime

class LoadCell:
    """HX711 로드셀 제어를 위한 클래스"""

    CALIBRATION_FILE = "calibration.cfg"

    def __init__(self, dout_pin=15, sck_pin=14, auto_tare=True, tare_delay=1, default_scale=None):
        """
        로드셀 초기화  
        - 전원 켠 후 자동 영점 보정(tare)  
        - 보정 파일(calibration.cfg)이 있으면 SCALE 값을 불러오고, 없으면 default_scale을 사용
        
        Args:
            dout_pin (int): DOUT 핀 번호 (기본값: 15)
            sck_pin (int): SCK 핀 번호 (기본값: 14)
            auto_tare (bool): 전원 켠 후 자동으로 영점 보정할지 여부 (기본값: True)
            tare_delay (float): 전원 켠 후 영점 보정 전 대기 시간(초) (기본값: 1)
            default_scale (float or None): 보정 파일이 없을 경우 사용할 기본 SCALE 값.
                                           None이면 보정되지 않은 상태로 경고 메시지를 출력함.
        """
        self.dout = DigitalInputDevice(dout_pin)
        self.sck = DigitalOutputDevice(sck_pin)
        self.OFFSET = 0
        self.SCALE = 1  # 보정되지 않은 상태의 기본 SCALE 값
        self.is_calibrated = False

        if auto_tare:
            print(f"전원 켠 후 {tare_delay}초 대기 중...")
            sleep(tare_delay)
            if self.tare():
                print("자동 영점 보정(Zero Tare)이 완료되었습니다.")
            else:
                print("자동 영점 보정에 실패했습니다.")

        # 보정 파일이 있으면 불러오고, 없으면 default_scale 사용
        if os.path.exists(self.CALIBRATION_FILE):
            if self.load_calibration(self.CALIBRATION_FILE):
                print("보정 파일에서 SCALE 값을 불러왔습니다.")
            else:
                print("보정 파일 불러오기에 실패했습니다.")
        else:
            if default_scale is not None:
                self.SCALE = default_scale
                self.is_calibrated = True
                print(f"보정 파일이 없습니다. default_scale 값({self.SCALE})을 사용하여 자동 스케일링합니다.")
            else:
                print("보정 파일이 없습니다. 최초 보정을 진행해주세요.")

    def read_raw_data(self):
        """원시 데이터 읽기"""
        self.sck.off()
        # DOUT 신호가 준비될 때까지 대기
        while self.dout.value:
            sleep(0.001)

        data = 0
        for _ in range(24):
            self.sck.on()
            data = (data << 1) | self.dout.value
            self.sck.off()

        # 마지막 펄스로 게인 설정
        self.sck.on()
        self.sck.off()
        return data

    def tare(self, times=15):
        """
        영점 조정 (여러 번 측정 후 평균값을 OFFSET으로 설정)
        
        Args:
            times (int): 평균 측정 횟수 (기본값: 15)
        
        Returns:
            bool: 영점 조정 성공 여부
        """
        try:
            total = 0
            for _ in range(times):
                total += self.read_raw_data()
            self.OFFSET = total / times
            return True
        except Exception as e:
            print(f"영점 조정 중 오류 발생: {e}")
            return False

    def get_value(self, times=7):
        """
        보정된 값 읽기 (OFFSET 적용 및 이상치 제거)
        
        Args:
            times (int): 측정 횟수 (기본값: 7)
        
        Returns:
            float: 보정된 측정값
        """
        readings = []
        for _ in range(times):
            readings.append(self.read_raw_data() - self.OFFSET)
            sleep(0.005)  # 짧은 딜레이 추가

        # 충분한 측정값이 있으면 최대, 최소값을 제거하여 이상치를 보정
        if len(readings) >= 5:
            readings.sort()
            filtered = readings[1:-1]
        else:
            filtered = readings

        return float(sum(filtered) / len(filtered))

    def get_weight(self, times=7, unit='g'):
        """
        무게 측정
        
        Args:
            times (int): 측정 횟수 (기본값: 7)
            unit (str): 무게 단위 ('g' 또는 'kg') (기본값: 'g')
        
        Returns:
            float: 측정된 무게
        """
        if not self.is_calibrated:
            print("경고: 보정이 되지 않은 상태입니다. 올바른 무게를 얻으려면 calibrate()를 실행하거나 저장된 보정값 파일 또는 default_scale을 사용하세요.")
        
        value = self.get_value(times)
        weight = - (value / self.SCALE)

        
        if unit == 'kg':
            weight = weight / 1000
            
        return round(weight, 3)

    def calibrate(self, known_weight_g):
        """
        저울 보정 (예: 100g 기준 보정)  
        최초 보정 시 100g 분동을 올려놓고 진행하면, SCALE 값이 계산되어 저장됩니다.
        
        Args:
            known_weight_g (float): 기준 무게(g) (예: 100)
        
        Returns:
            bool: 보정 성공 여부
        """
        try:
            print("########################################")
            print("보정 안내:")
            print("1. 저울 위의 모든 물체를 제거해주세요.")
            print("2. 준비되면 Enter를 눌러 영점 보정을 진행합니다.")
            print("########################################")
            input("Enter를 누르세요...")

            if self.tare():
                print("영점 보정(Zero Tare)이 완료되었습니다.")
            else:
                print("영점 보정에 실패했습니다. 다시 시도해주세요.")
                return False

            print("########################################")
            print(f"보정을 위해 {known_weight_g}g 기준 분동을 저울 위에 올려주세요.")
            print("준비되면 Enter를 눌러 진행합니다.")
            print("########################################")
            input("Enter를 누르세요...")

            measured_value = self.get_value(times=15)
            self.SCALE = measured_value / known_weight_g
            self.is_calibrated = True

            print("보정이 완료되었습니다!")
            print(f"측정된 기준값: {measured_value:.3f}")
            print(f"계산된 SCALE 값: {self.SCALE:.6f}")

            # 보정값을 파일에 저장
            self.save_calibration(self.CALIBRATION_FILE)
            print("보정값이 파일에 저장되었습니다.")
            return True

        except Exception as e:
            print(f"보정 중 오류 발생: {e}")
            return False

    def save_calibration(self, filename):
        """
        현재 보정값(OFFSET과 SCALE)을 파일에 저장
        
        Args:
            filename (str): 저장할 파일 이름
        """
        try:
            with open(filename, "w") as f:
                # OFFSET과 SCALE 저장
                f.write(f"{self.OFFSET}\n")
                f.write(f"{self.SCALE}\n")
        except Exception as e:
            print(f"보정값 저장 실패: {e}")

    def load_calibration(self, filename):
        """
        파일에서 보정값(OFFSET과 SCALE)을 불러옴
        
        Args:
            filename (str): 불러올 파일 이름
        
        Returns:
            bool: 보정값 불러오기 성공 여부
        """
        try:
            with open(filename, "r") as f:
                lines = f.readlines()
                if len(lines) >= 2:
                    self.OFFSET = float(lines[0].strip())
                    self.SCALE = float(lines[1].strip())
                    self.is_calibrated = True
                    return True
                else:
                    return False
        except Exception as e:
            print(f"보정값 불러오기 실패: {e}")
            return False
    
    def save_weight_data(self, weight, data_type="weight", serial_number="SN123456"):
        """
        단일 무게 측정 데이터를 JSON 형식으로 저장
        
        Args:
            weight: 측정된 무게(g)
            data_type: 데이터 타입 (기본값: "weight")
            serial_number: 장치 시리얼 번호
            
        Returns:
            str: 저장된 파일 경로
        """
        # 저장 디렉토리 확인 및 생성
        data_dir = "data/weight"
        os.makedirs(data_dir, exist_ok=True)
        
        # 현재 시간
        now = datetime.now()
        timestamp = now.isoformat(timespec='seconds')
        
        # 데이터 구성
        weight_data = {
            "serial_number": serial_number,
            "datetime": timestamp,
            "type": data_type,
            "data": {
                "weight": weight
            }
        }
        
        # 파일명 생성 (타임스탬프 사용)
        filename = f"{data_dir}/weight_{now.strftime('%Y%m%d_%H%M%S')}.json"
        
        # 파일 저장
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(weight_data, f, ensure_ascii=False, indent=2)
        
        return filename
    
    def save_intake_data(self, duration_minutes, amount_grams, serial_number="SN123456"):
        """
        섭취 데이터를 JSON 형식으로 저장
        
        Args:
            duration_minutes: 섭취 지속 시간(분)
            amount_grams: 섭취량(g)
            serial_number: 장치 시리얼 번호
            
        Returns:
            str: 저장된 파일 경로
        """
        # 저장 디렉토리 확인 및 생성
        data_dir = "data/intake"
        os.makedirs(data_dir, exist_ok=True)
        
        # 현재 시간
        now = datetime.now()
        timestamp = now.isoformat(timespec='seconds')
        
        # 데이터 구성
        intake_data = {
            "serial_number": serial_number,
            "datetime": timestamp,
            "type": "intake",
            "data": {
                "duration": duration_minutes,
                "amount": amount_grams
            }
        }
        
        # 파일명 생성 (타임스탬프 사용)
        filename = f"{data_dir}/intake_{now.strftime('%Y%m%d_%H%M%S')}.json"
        
        # 파일 저장
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(intake_data, f, ensure_ascii=False, indent=2)
        
        return filename


# 메인 함수 분리 - 다른 모듈에서 함수로 활용할 수 있도록 함수화
def measure_weight(loadcell, times=10):
    """
    단일 무게 측정 함수
    
    Args:
        loadcell: LoadCell 인스턴스
        times: 측정 횟수
        
    Returns:
        float: 측정된 무게(g)
    """
    return loadcell.get_weight(times=times)

def detect_weight_change(prev_weight, current_weight, threshold=5.0):
    """
    무게 변화 감지 함수
    
    Args:
        prev_weight: 이전 무게(g)
        current_weight: 현재 무게(g)
        threshold: 의미있는 변화로 간주할 최소 무게 차이(g)
        
    Returns:
        tuple: (변화 감지 여부(bool), 변화량(g))
    """
    change = current_weight - prev_weight
    if abs(change) >= threshold:
        return True, change
    return False, 0

def process_weight_change(start_weight, end_weight, duration_seconds, loadcell=None, threshold=0):
    """
    무게 변화 처리 함수 - 변화가 감지되었을 때 호출
    
    Args:
        start_weight: 시작 무게(g)
        end_weight: 종료 무게(g)
        duration_seconds: 변화 지속 시간(초)
        loadcell: LoadCell 인스턴스 (저장 필요 시)
        threshold: 의미있는 변화 기준(g)
        
    Returns:
        dict: 처리 결과 정보
    """
    amount = start_weight - end_weight
    duration_minutes = round(duration_seconds / 60, 1)
    
    result = {
        "start_weight": start_weight,
        "end_weight": end_weight,
        "change_amount": amount,
        "duration_seconds": duration_seconds,
        "duration_minutes": duration_minutes,
        "is_significant": abs(amount) >= threshold
    }
    
    # 무게가 감소한 경우 (섭취로 간주)
    if amount > 0 and loadcell:
        filename = loadcell.save_intake_data(
            duration_minutes=round(duration_minutes),
            amount_grams=round(amount)
        )
        result["saved_file"] = filename
        result["event_type"] = "intake"
        
    # 무게가 증가한 경우 (추가로 간주)
    elif amount < 0 and loadcell:
        filename = loadcell.save_weight_data(
            weight=end_weight,
            data_type="weight_added"
        )
        result["saved_file"] = filename
        result["event_type"] = "addition"
    
    return result


# 예시: 메인 함수
if __name__ == "__main__":
    # default_scale 값은 보정 파일이 없을 경우에 사용할 기본 SCALE 값입니다.
    DEFAULT_SCALE = 440.0  # 경험적으로 보정된 SCALE 값

    loadcell = LoadCell(dout_pin=15, sck_pin=14, auto_tare=True, tare_delay=1, default_scale=DEFAULT_SCALE)

    # 사용 모드 선택
    print("\n사용 모드를 선택하세요:")
    print("1. 단일 측정")
    print("2. 무게 변화 감지 데모")
    print("3. 보정 실행")
    
    try:
        mode = int(input("모드 선택 (1-3): "))
        
        if mode == 1:
            # 단일 측정 실행
            weight = measure_weight(loadcell, times=10)
            print(f"측정된 무게: {weight}g")
            
            # JSON 저장 여부 확인
            save_option = input("측정 결과를 JSON으로 저장하시겠습니까? (y/n): ").lower()
            if save_option == 'y':
                filename = loadcell.save_weight_data(weight)
                print(f"측정 결과가 {filename}에 저장되었습니다.")
                
        elif mode == 2:
            # 무게 변화 감지 데모
            print("\n무게 변화 감지 데모를 시작합니다. (종료: Ctrl+C)")
            print("변화 감지 설정:")
            threshold = float(input("의미있는 변화로 간주할 최소 무게 차이(g)를 입력하세요 (기본값: 5.0): ") or "5.0")
            stable_duration = float(input("안정적인 상태로 판단할 시간(초)를 입력하세요 (기본값: 3.0): ") or "3.0")
            interval = float(input("측정 간격(초)을 입력하세요 (기본값: 0.5): ") or "0.5")
            
            # 변수 초기화
            prev_weight = measure_weight(loadcell)
            print(f"초기 무게: {prev_weight}g")
            
            is_change_detected = False
            start_weight = 0
            start_time = 0
            last_change_time = time()
            
            try:
                while True:
                    # 단일 측정으로 현재 무게 확인
                    current_weight = measure_weight(loadcell)
                    current_time = time()
                    
                    # 무게 변화 감지 (모듈화된 함수 사용)
                    changed, change_amount = detect_weight_change(
                        prev_weight, 
                        current_weight,
                        threshold=threshold
                    )
                    
                    if changed:
                        print(f"현재 무게: {current_weight}g (변화량: {change_amount:+.1f}g)")
                        
                        if not is_change_detected:
                            # 변화 시작 감지
                            is_change_detected = True
                            start_time = current_time
                            start_weight = prev_weight
                            print(f"변화 감지 시작: 초기 무게 {start_weight}g")
                        
                        last_change_time = current_time
                    else:
                        # 가끔 현재 무게 표시
                        if int(current_time) % 5 == 0:
                            print(f"현재 무게: {current_weight}g (안정적)")
                    
                    # 진행 중인 측정이 있고, 일정 시간동안 변화가 없으면 측정 종료
                    if is_change_detected and (current_time - last_change_time >= stable_duration):
                        # 변화 처리 함수 호출
                        result = process_weight_change(
                            start_weight,
                            current_weight,
                            current_time - start_time,
                            loadcell=loadcell,
                            threshold=threshold
                        )
                        
                        # 결과 출력
                        if result["change_amount"] > 0:
                            print(f"섭취 감지: {round(result['change_amount'])}g, 지속시간: {result['duration_minutes']}분")
                            if "saved_file" in result:
                                print(f"데이터 저장됨: {result['saved_file']}")
                        elif result["change_amount"] < 0:
                            print(f"무게 추가 감지: {abs(round(result['change_amount']))}g 추가됨")
                            if "saved_file" in result:
                                print(f"데이터 저장됨: {result['saved_file']}")
                        
                        is_change_detected = False
                    
                    prev_weight = current_weight
                    sleep(interval)
                    
            except KeyboardInterrupt:
                print("\n변화 감지 데모를 종료합니다.")
            
        elif mode == 3:
            # 보정 실행
            known_weight = float(input("보정에 사용할 기준 무게(g)를 입력하세요 (기본값: 100): ") or "100")
            loadcell.calibrate(known_weight_g=known_weight)
            
        else:
            print("잘못된 모드를 선택했습니다.")
            
    except ValueError:
        print("숫자를 입력해주세요.")
    except KeyboardInterrupt:
        print("\n프로그램을 종료합니다.")
    finally:
        print("프로그램이 종료되었습니다.")
