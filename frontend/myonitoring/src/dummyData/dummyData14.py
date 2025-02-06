from datetime import datetime, timedelta
import random

# 시작 날짜 설정
start_date = datetime(2025, 2, 3)

# 더미 데이터 생성
feeding_data = []

for day in range(14):  # 14일치 데이터 생성
    current_date = start_date + timedelta(days=day)
    feeding_amount = 70  # 하루 배급량 고정

    # 하루 동안의 섭취 기록 초기화
    feeding_times = []
    total_intake = 0  # 하루 총 섭취량 초기화

    for i in range(4):  # 하루에 4번 밥을 준다고 가정
        feed_time = current_date + timedelta(hours=6 * i)  # 6시간 간격으로 급여
        feed_amount = random.randint(10, 20)  # 한 번의 배급량은 10~20g 사이

        # 고양이가 20분 간격으로 나눠 먹는 데이터 생성
        time_intervals = []
        interval_time = feed_time
        remaining_amount = feed_amount
        cumulative_intake = 0  # 해당 급여 시간 기준 누적 섭취량 초기화

        while remaining_amount > 0:
            interval_intake = min(4, remaining_amount)  # 한 번에 최소 4g 섭취
            remaining_amount -= interval_intake
            cumulative_intake += interval_intake

            time_intervals.append({
                "time": interval_time.strftime("%Y-%m-%d %H:%M:%S"),
                "intake": interval_intake,
                "cumulative_intake": cumulative_intake
            })
            interval_time += timedelta(minutes=20)  # 20분 간격으로 먹음

        # 각 급여 시간 데이터 추가
        feeding_times.append({
            "time": feed_time.strftime("%Y-%m-%d %H:%M:%S"),
            "feed_amount": feed_amount,
            "intervals": time_intervals
        })

        # 하루 총 섭취량 업데이트 (해당 급여 시간의 누적 섭취량 추가)
        total_intake += cumulative_intake

    # 하루 데이터 추가
    feeding_data.append({
        "date": current_date.strftime("%Y-%m-%d"),
        "total_intake": total_intake,
        "feeding_amount": feeding_amount,
        "feeding_times": feeding_times
    })

# 결과를 JSON 파일로 저장 (선택 사항)
import json

with open("feeding_data.json", "w", encoding="utf-8") as json_file:
    json.dump(feeding_data, json_file, indent=4, ensure_ascii=False)
