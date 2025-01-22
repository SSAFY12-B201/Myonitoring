# 프로젝트 초기 설정 및 Workflow

<details>
<summary>초기 설정</summary>
<div markdown="1">

1. **로컬에 Git Clone**
   ```bash
   git clone <repository-url>
   ```
2. **git hook 설정**
   - pre-commit 설치:
     ```bash
     pip install pre-commit
     ```
   - git hook 활성화:
     ```bash
     pre-commit install --hook-type commit-msg
     ```

</div>
</details>

## Workflow
example
```bash
# 1. dev 최신화 및 작업 브랜치 생성
git checkout dev
git pull origin dev

git checkout -b seoyun2da

# 2. 작업 및 커밋 (수정한 파일에 맞게 파일 추가)
git add payments.py
git commit -m "[feat] 결제 API 개발 #PROJ-205"

# 3. 원격 저장소로 푸시 (작업 내용 자유롭게 푸시)
git push origin seoyun2da

# 4. MR 전에는 아래 단계를 추가로 수행
# 4-1. 병합 전 dev 최신 상태로 동기화
git checkout dev
git pull origin dev

# 4-2. 작업 브랜치에 최신 상태의 dev를 병합
git checkout seoyun2da
git merge dev

# 5. 충돌 해결 단계 (필요 시, 충돌 발생하면 여기서 멈춤)
#    - 충돌 파일 수정 후:
#      git add [수정된 파일]
#      git commit -m "[fix] dev 병합 충돌 해결"
#    - 이후 계속 진행

# 6. 원격 저장소로 병합 결과 푸시
git push origin seoyun2da

# 7. MR 생성 -> GitLab에서 MR 생성 후 dev로 병합 (수동 작업)

# 8. 병합 후 로컬 및 원격 브랜치 삭제
git branch -d seoyun2da
git push origin --delete seoyun2da
```

---

1. **dev 최신화 및 작업 브랜치 생성**
    - `dev`브랜치를 최신 상태로 업데이트합니다.
    - `dev`브랜치로부터 작업 브랜치(`my-branch`)를 생성하고 작업을 진행합니다. 
    - [브랜치 생성 관련 자료](https://www.notion.so/Branch-ac2597a3e18a406b99c89b0e0d312546)
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b <my-branch>
   ```
2. **작업 및 커밋**
   - 필요한 작업을 진행하고 변경 사항을 저장합니다.
   - 변경 사항 스테이징:
     ```bash
     git add <file-name>
     ```
   - 커밋:
     ```bash
     git commit -m "[type] 구현한 기능 설명 #jira-issue-key"
     ```
     예: 
     ```bash
     git commit -m "[feat] 결제 API 개발 #PROJ-1234"
     ```
   - **주의**: 커밋 메시지가 [commit convention](<https://www.notion.so/Git-b876e446a62a420cad5de055e8ed1bc8>)을 따르지 않으면 git hook에 의해 커밋이 차단됩니다.

3. **원격 레포지토리에 push**
   - **주의사항**
     - `dev` 및 `master` 브랜치에 **직접 푸시 금지**.
   - 작업 브랜치를 원격으로 push:
     ```bash
     git push origin <my-branch>
     ```

4. 병합 전 dev 브랜치와 동기화
   - `dev` 브랜치의 최신 내용을 가져와 충돌 여부를 확인합니다.
     ```bash
     git checkout dev
     git pull origin dev  # dev 최신화
     
     # 작업 브랜치로 돌아가 dev 내용을 병합
     git checkout <my-branch>
     git merge dev  # dev를 작업 브랜치에 병합
     ```

5. 충돌 해결 (필요 시)
   - 병합 중 충돌이 발생하면 아래 단계를 수행합니다:
     1. 충돌 파일에서 `<<<<<`, `>>>>>`로 표시된 부분을 수정.
     2. 수정 완료 후 커밋
     ```bash
     git add [충돌 해결된 파일]
     git commit -m "[fix] dev 병합 충돌 해결"
     ```
     
6. 수정된 브랜치를 다시 원격 저장소로 푸시
   ```bash
   git push origin <my-branch>
   ```

7. **MR 생성 및 dev로 병합**
   - [MR 작성 방법](<https://www.notion.so/PR-Pull-Request-48e7e51a1ebd42baac9a007cff3f879e>)에 따라 MR을 작성합니다.
   - **MR 제목 형식:**
     - `[Type] 작업 내용 (Jira 이슈 키)`
   - **MR 설명 템플릿:**
    
       ```markdown
       ### 🛠 작업 내용  
       - [ ] 주요 기능 개발  
       - [ ] 버그 수정  
       - [ ] 문서 업데이트  
       - [ ] 리팩토링  
       - [ ] 기타 작업  
    
       **설명:**  
       - 작업한 주요 내용을 간략하게 작성합니다.  
       - 기능 추가, 수정 사항, 파일 변경 내용을 구체적으로 기재하세요.  
    
       ---
    
       ### ✅ 테스트 방법  
       - [ ] 로컬 환경에서 기능 확인  
       - [ ] 유닛 테스트 추가 및 통과  
       - [ ] API 호출 및 결과 확인  
    
       **설명:**  
       - 기능을 테스트한 방법을 단계별로 작성합니다.  
       - 필요한 경우, API 경로 또는 명령어를 명시합니다.  
    
       ---
    
       ### 🚩 참고 사항  
       - 추가로 리뷰어가 확인해야 할 사항이나, 남겨둔 TODO를 기재합니다.  
       - 배포 후 확인이 필요한 경우도 명시하세요.  
    
       ---
    
       ### 🎯 관련 이슈  
       - Closes #[이슈번호]  
       - Fixes #[이슈번호]  
       - Resolves #[이슈번호]  
       ```
   
   - 코드 병합은 `dev` 브랜치에서 진행합니다.
   - 배포 시, `master` 브랜치에 병합하는 것을 원칙으로 합니다.
   
8. **병합 후 브랜치 삭제**
   - 병합이 완료되면, 사용한 브랜치를 삭제하여 작업을 정리합니다. 
    ```bash
    # 로컬 브랜치 삭제
    git branch -d seoyun2da
    
    # 원격 브랜치 삭제
    git push origin --delete seoyun2da
    
    ```

---

### 주의사항
- 브랜치 관리를 철저히 하고, `dev`와 `master` 브랜치에 직접 푸시하지 않습니다.
- 모든 커밋 메시지는 지정된 [commit convention](<https://www.notion.so/Git-b876e446a62a420cad5de055e8ed1bc8>)을 따라야 합니다.
- MR은 팀 규칙에 따라 작성하고 승인 절차를 거칩니다.