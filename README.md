# 개요

- 대시보드 실시간 알람 기능 관련하여, 기존 TOAST 메시지 방식은 순간적으로 많은 알람이 몰릴 경우 메모리 누수 발생과 사용자 인지 어려움 문제가 있었습니다.  
- 카카오톡 채팅 형태로 알람 UI를 구성하면 좀 더 직관적일 것 같아, 퇴근 후 집에서 간단히 레이아웃을 설계했습니다.

---


## 적용 결과

- 실시간 알람은 RabbitMQ를 사용하며, 데이터가 문자열(string) 형태로 넘어와 화면에서 메시지 파싱 및 분류가 필요  
- 단기간에 너무 많은 요청으로 콜 스택이 빠르게 채워져 화면 블로킹 현상 발생  
- async/await 기반 마이크로태스크 큐 처리 방법도 검토했으나, 실시간 알림은 우선순위가 높아 웹 워커를 추가해 데이터 파싱 위임 및 실시간 처리 가능하도록 구현  
- 해당 기능은 PAS-K 대시보드 시스템 모니터링의 실시간 알람 기능에 적용됨


---

## 목표

- 카카오톡을 참고하여 프로필 아이콘(카테고리), 이름(알람 ID), 메시지(내용), 시간(알람 시간)을 시각화 제공  
  - `[프로필(알람 카테고리)] [알람 ID] [알람 내용] [시간]` 형태  
  - 알람은 화면 우측 하단에 표시하며, box-shadow로 입체감 처리하여 다른 콘텐츠와 구분

---

## 메모리 누수 관련 해결 방안

- 현재 대시보드 데이터는 1분간 데이터만 유지 후 삭제하지만, 알람은 중요한 데이터이므로 별도 처리 필요  
  - 최근 100~300개 정도 보관 예정  
  - RabbitMQ 웹소켓을 통한 실시간 통신으로, 초당 수십 개의 알람이 발생할 수 있어 `setState` 사용 시 렌더링 및 성능 이슈 예상  
  - `setState` 대신 localStorage에 저장 후 ref로 관리하는 방식 고려 중  
  - 알람은 새로고침 시 재호출 필요 없으며, unmount 시 localStorage 삭제 예정

---

## 내일 출근 후 확인 사항

- 현재 메시지 배경색은 파랑/회색만 존재하나, 알람 레벨(경고, 정상 등)에 따른 배경색 구분 검토  
- 릴리즈 일정이 촉박해 어려울 경우 추후 개발로 조정

---

## 부가 기능 (회사에서 사용 안 할 가능성 높음)

- 채팅방 제목 영역 추가 (불필요한 테두리 없이 배경색 구분)  
- 내 메시지는 텔레그램 UI 참고하여 파란색, 그 외는 회색 지정  
- 추후 이모티콘, 파일 첨부 버튼 추가 공간 마련 (임시 버튼 처리)  
- 메시지 입력창 추가 (ENTER 이벤트 처리 필요)

---

## 참고: CHAT-UI LAYOUT 구성

![image](https://github.com/user-attachments/assets/33a64964-4122-4340-9740-54141c33eb72)

---
