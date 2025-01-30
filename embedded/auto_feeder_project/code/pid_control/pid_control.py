import time
import random
from scipy.optimize import minimize  # Nelder-Mead 알고리즘 사용을 위한 import

class PIDController:
    """PID 제어기 클래스 (Nelder-Mead 자동 튜닝 기능 추가)"""
    # ... (기존 PIDController 클래스 코드는 동일)
    def __init__(self, kp, ki, kd, setpoint): # __init__ 함수는 변경 없음
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.setpoint = setpoint
        self.integral_term = 0.0
        self.last_error = 0.0
        self.last_time = time.time()
        self.output_limit = None

    def set_output_limit(self, limit): # set_output_limit 함수는 변경 없음
        self.output_limit = limit

    def update(self, current_value): # update 함수는 변경 없음
        current_time = time.time()
        dt = current_time - self.last_time

        error = self.setpoint - current_value

        proportional_term = self.kp * error

        self.integral_term += self.ki * error * dt
        if self.output_limit:
            self.integral_term = max(min(self.integral_term, self.output_limit), -self.output_limit)

        derivative_term = self.kd * (error - self.last_error) / dt

        output = proportional_term + self.integral_term + derivative_term

        if self.output_limit:
            output = max(min(output, self.output_limit), -self.output_limit)

        self.last_error = error
        self.last_time = current_time
        return output

    def reset_integral_term(self): # reset_integral_term 함수는 변경 없음
        self.integral_term = 0.0

    def evaluate_performance(self, current_value_history, setpoint): # evaluate_performance 함수는 변경 없음
        sse = 0.0
        for value in current_value_history:
            error = setpoint - value
            sse += error**2
        return sse


    def auto_tune_params_nelder_mead(self, initial_params, initial_value, setpoint, simulation_time=10.0, dt=0.1):
        """Nelder-Mead Simplex 알고리즘으로 PID 파라미터 자동 튜닝
        Args:
            initial_params (list): 초기 파라미터 값 [kp, ki, kd]
            initial_value (float): 초기 현재 값
            setpoint (float): 목표 값
            simulation_time (float): 튜닝 시뮬레이션 시간 (초)
            dt (float): 시뮬레이션 시간 간격 (초)
        Returns:
            dict: 최적 파라미터 (SSE 점수가 가장 낮은 파라미터 조합)
        """

        def objective_function(params): # Nelder-Mead 알고리즘이 최소화할 목적 함수 (SSE)
            kp, ki, kd = params
            self.kp = kp # PID 파라미터 설정
            self.ki = ki
            self.kd = kd
            self.setpoint = setpoint
            self.reset_integral_term()

            current_value = initial_value
            current_value_history = []
            start_time = time.time()

            while time.time() - start_time < simulation_time: # 시뮬레이션
                output = self.update(current_value)
                current_value += output * dt
                current_value = max(0.0, min(100.0, current_value))
                current_value_history.append(current_value)
                time.sleep(dt) # 실제 시스템에서는 time.sleep() 제거

            sse = self.evaluate_performance(current_value_history, setpoint) # 성능 평가 (SSE)
            return sse # Nelder-Mead 알고리즘은 이 SSE 값을 최소화하는 파라미터를 찾음

        # Nelder-Mead 알고리즘 실행 (scipy.optimize.minimize 사용)
        result = minimize(objective_function, initial_params, method='Nelder-Mead')

        if result.success: # 최적화 성공 여부 확인
            best_params = {'kp': result.x[0], 'ki': result.x[1], 'kd': result.x[2]} # 최적 파라미터 추출
            min_sse = result.fun # 최소 SSE 값
            print("Nelder-Mead 자동 튜닝 완료")
            print(f"최적 파라미터: {best_params}, 최소 SSE: {min_sse:.2f}")
            return best_params
        else:
            print("Nelder-Mead 자동 튜닝 실패")
            print(result.message) # 실패 메시지 출력
            return None # 튜닝 실패 시 None 반환


if __name__ == '__main__':
    try:
        # --- [1] 기본 PID 제어 테스트 (자동 튜닝 X) ---
        print("--- 기본 PID 제어 테스트 ---")
        kp = 1.0
        ki = 0.1
        kd = 0.01
        setpoint = 50.0

        pid_controller = PIDController(kp, ki, kd, setpoint)
        pid_controller.set_output_limit(100)

        current_value = 0.0
        print(f"목표 값 (Set Point): {setpoint}")

        start_time_basic_control = time.time()
        while time.time() - start_time_basic_control < 5.0:
            output = pid_controller.update(current_value)
            print(f"현재 값: {current_value:.2f}, 출력 값: {output:.2f}")
            current_value += output * 0.01
            current_value = max(0.0, min(100.0, current_value))
            time.sleep(0.1)
        print("기본 PID 제어 테스트 종료\n")


        # --- [2] Nelder-Mead 자동 튜닝 테스트 ---
        print("--- Nelder-Mead 자동 튜닝 시작 ---")
        initial_params = [0.5, 0.05, 0.005] # 초기 파라미터 값 (kp, ki, kd 순서) - 적절한 초기값 중요!
        initial_value = current_value # 이전 제어 종료 시점의 current_value 사용
        setpoint_tuning_nm = 60.0 # 튜닝 목표 값

        best_params_nm = pid_controller.auto_tune_params_nelder_mead(
            initial_params, initial_value, setpoint_tuning_nm, simulation_time=5.0, dt=0.1
        )

        if best_params_nm: # 튜닝 성공 시에만 파라미터 적용
            print(f"Nelder-Mead Best Params: {best_params_nm}\n")

            # 튜닝된 파라미터로 PID 제어 (Nelder-Mead 결과 적용)
            print("--- Nelder-Mead 튜닝 파라미터 적용 PID 제어 테스트 ---")
            pid_controller.kp = best_params_nm['kp'] # 최적 파라미터 적용
            pid_controller.ki = best_params_nm['ki']
            pid_controller.kd = best_params_nm['kd']
            pid_controller.setpoint = setpoint_tuning_nm # 튜닝 목표 값으로 setpoint 변경
            pid_controller.reset_integral_term()

            current_value = initial_value # 튜닝 시작 시점의 current_value 로 초기화
            print(f"튜닝된 파라미터 목표 값 (Set Point): {setpoint_tuning_nm}")
            start_time_tuned_control_nm = time.time()
            while time.time() - start_time_tuned_control_nm < 5.0:
                output = pid_controller.update(current_value)
                print(f"현재 값: {current_value:.2f}, 출력 값: {output:.2f}")
                current_value += output * 0.01
                current_value = max(0.0, min(100.0, current_value))
                time.sleep(0.1)
            print("Nelder-Mead 튜닝 파라미터 적용 PID 제어 테스트 종료\n")
        else:
            print("Nelder-Mead 튜닝 실패로 튜닝된 파라미터 적용 안 함\n")


    except (KeyboardInterrupt, SystemExit):
        print("PID Controller 테스트 종료")