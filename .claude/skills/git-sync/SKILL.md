---
name: git-sync
description: 변경사항을 원격 저장소에 올리거나(add/commit/pull/push), 메인 브랜치를 합치거나, merge conflict를 해결해 달라는 요청을 받았을 때 사용한다. 코드 정리·검증까지 요청하면 git-simplify를 쓴다.
---

# Git 동기화 (add → commit → pull → push)

> 코드 정리나 검증까지 요청받았다면 이 스킬 대신 git-simplify를 쓴다. git-simplify는 정리·검증이 끝난 뒤 이 스킬의 작업 사이클로 이어진다.

## 메인 브랜치 확인
작업 전에 이 저장소의 메인 브랜치를 아래 순서로 정한다. 앞에서 정해지면 뒤는 보지 않는다.
1. 사용자가 브랜치를 지정했으면 그 브랜치를 쓴다.
2. 저장소의 `CLAUDE.md`에 메인 브랜치가 적혀 있으면 그 브랜치를 쓴다.
3. `git symbolic-ref --short refs/remotes/origin/HEAD`로 원격 기본 브랜치를 확인한다. (결과 예: origin/master → master)
4. 3이 실패하면 `git remote show origin`의 "HEAD branch" 값을 쓴다.
5. 그래도 확인이 안 되면 어느 브랜치에 합칠지 사용자에게 묻는다.

정한 브랜치는 진행 전에 사용자에게 한 줄로 알린다. (예: "메인 브랜치: develop")
아래에서 `<메인브랜치>`는 여기서 정한 브랜치를 뜻한다.

## 기본 원칙
- 현재 작업 중인 브랜치에서 진행한다. 브랜치를 이동(checkout)하지 않고 `git pull origin <메인브랜치>`로 최신 내용을 합친다.
- 커밋하지 않은 변경을 잠시 치워야 하면 `git stash`를 쓰고, 작업이 끝나면 `git stash pop`으로 되돌린다.
- 다음 명령은 사용자가 명시적으로 요청하지 않는 한 실행하지 않는다: `push --force`, `reset --hard`, `clean -f`, 브랜치 삭제.

## 작업 사이클
1. `git status`로 변경 사항을 확인한다.
2. 추가할 파일 목록을 사용자에게 보여 준다. `.env`, 인증 정보, 빌드 결과물이 섞여 있으면 알리고 제외 여부를 확인한다.
3. `git add <파일들>`로 추가한다. 목록에 문제가 없으면 `git add .`을 써도 된다.
4. `git diff --staged`로 변경 내용을 보고 커밋 메시지를 제안한다. 사용자가 확인하면 `git commit -m "<메시지>"`로 커밋한다.
5. `git pull --no-rebase origin <메인브랜치>`로 최신 내용을 합친다.
   - 충돌이 나면 아래 "Conflict 대처"로 넘어간다.
6. `git push`로 올린다.
   - 원격에 아직 없는 브랜치라면 `git push -u origin <현재브랜치>`를 쓴다.
   - push가 거절되면 force push하지 말고 5단계부터 다시 진행한다.

## Conflict 대처
충돌을 해결하기 전에 반드시 상황을 먼저 설명하고, 사용자의 결정을 받은 뒤 진행한다.

1. `git status`로 충돌 파일(both modified)을 확인한다.
2. 각 파일의 충돌 구간을 찾아 사용자에게 보여 준다.
   - `<<<<<<< HEAD` ~ `=======` : 내 변경 (current)
   - `=======` ~ `>>>>>>> ...` : 가져온 변경 (incoming)
3. 충돌 구간마다 다음 중 하나를 제안하고, 어떤 것이 좋을지 이유와 함께 추천한다.
   - 내 코드 유지
   - 가져온 코드 유지
   - 둘 다 합치기 (합친 결과를 미리 보여 준다)
4. 사용자가 선택하면 파일을 수정하고 충돌 마커를 모두 지운다.
   - `git diff --check`로 남은 마커가 없는지 확인한다.
5. `git add <해결한 파일>` → `git commit`(merge 기본 메시지 사용) → `git push` 순서로 진행한다.
6. 해결이 꼬였거나 사용자가 취소를 원하면 `git merge --abort`로 pull 이전 상태로 되돌린다.