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
1. **작업 브랜치 생성 및 이동**
    - 원격 `dev` 브랜치를 pull 받아옵니다.
    - local에서 `my-branch` 생성하고 작업을 진행합니다. 
    - [브랜치 생성 관련 자료](https://www.notion.so/Branch-ac2597a3e18a406b99c89b0e0d312546)
   ```bash
   git pull origin dev
   git checkout -b <branch-name>
   ```
2. **코드 작업**
   - 필요한 작업을 진행하고 변경 사항을 저장합니다.

3. **git에 add 및 commit**
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

4. **원격 레포지토리에 push**
   - **주의사항**
     - `dev` 및 `master` 브랜치에 **직접 푸시 금지**.
   - 작업 브랜치를 원격으로 push:
     ```bash
     git push origin <branch-name>
     ```
   - 이후, Merge Request(MR)를 생성하여 코드 병합을 진행합니다.

5. **MR 작성**
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
      - [MR 작성 방법](<https://www.notion.so/PR-Pull-Request-48e7e51a1ebd42baac9a007cff3f879e>)에 따라 MR을 작성합니다.

6. **코드 병합 및 배포**
   - 코드 병합은 `dev` 브랜치에서 진행합니다.
   - 배포 시, `master` 브랜치에 병합하는 것을 원칙으로 합니다.

---

### 주의사항
- 브랜치 관리를 철저히 하고, `dev`와 `master` 브랜치에 직접 푸시하지 않습니다.
- 모든 커밋 메시지는 지정된 [commit convention](<https://www.notion.so/Git-b876e446a62a420cad5de055e8ed1bc8>)을 따라야 합니다.
- MR은 팀 규칙에 따라 작성하고 승인 절차를 거칩니다.