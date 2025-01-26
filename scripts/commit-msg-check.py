#!/usr/bin/env python3
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


# Git이 전달한 커밋 메시지 파일 경로 읽기
commit_msg_filepath = sys.argv[1]

# 커밋 메시지 파일의 내용을 읽음
with open(commit_msg_filepath, 'r', encoding='utf-8') as file:
    commit_msg = file.read().strip()

print(f"검사할 커밋 메시지: {commit_msg}")

# 커밋 메시지 패턴 정의
pattern = r"^\[(feat|fix|docs|style|refactor|test|chore|ci|perf|revert)\] .+( #[A-Z]+-[0-9]+)?$"

# 정규식 검증
if not re.match(pattern, commit_msg):
    print("❌ 커밋 메시지가 컨벤션에 맞지 않습니다.")
    print("예시: [feat] 사용자 로그인 기능 추가 #PROJ-123")
    sys.exit(1)

print("✅ 커밋 메시지가 컨벤션에 맞습니다.")
