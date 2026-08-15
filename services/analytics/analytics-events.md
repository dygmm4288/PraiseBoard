# Analytics 이벤트 목록

이 문서는 `services/analytics`에서 `trackEvent`로 전송하는 이벤트와 실제 호출 시점을 정리한다.

이벤트 이름과 속성 타입의 기준은 [`core/analytics.types.ts`](./core/analytics.types.ts)의 `AnalyticsEventMap`이다.

## 이벤트

| 이벤트 이름 | 호출 시점 | 전달 값 |
| --- | --- | --- |
| `board_created` | 일반 보드 생성 API가 성공하거나 온보딩 보드 저장이 성공한 후 | `source`: `board_create` \| `onboarding` |
| `board_updated` | 보드 수정 API가 성공한 후 | 없음 |
| `board_deleted` | 보드 삭제 API가 성공한 후 | 없음 |
| `sticker_collected` | 스티커 저장 작업이 성공한 후 | `source`: `app` \| `widget` |
| `active_limit_reached` | 활성 보드 최대 개수 제한이 클라이언트 정책 또는 서버 RPC에서 확인됐을 때 | `source`: `client` \| `server` |
| `board_edit_started` | 보드 수정 바텀시트 표시 요청이 정상적으로 수락됐을 때 | 없음 |
| `stats_viewed` | 통계 화면 컴포넌트가 마운트됐을 때 | 없음 |
| `archive_viewed` | 보관함 화면 컴포넌트가 마운트됐을 때 | 없음 |
| `detail_viewed` | 보관함 상세 화면 컴포넌트가 마운트됐을 때 | 없음 |
| `onboarding_started` | 실제 온보딩 화면이 처음 마운트됐을 때 | 없음 |
| `onboarding_step_completed` | 현재 온보딩 단계의 입력 검증과 처리가 끝나 다음 단계로 이동할 때 | `step`: `name` \| `title` \| `reward` \| `limit` \| `limitCount` \| `notification` |
| `notification_toggle` | 설정에서 알림 상태 변경 후 서버 상태 재조회까지 성공했을 때 | `requested_enabled`, `result_enabled`, `permission_status` |
| `notification_permission_result` | OS 알림 권한 결과를 push state에 저장한 후 | `status`: `granted` \| `denied` \| `undetermined` |
| `action_failed` | 추적 대상 사용자 작업의 `catch` 또는 mutation `onError`에서 | `action`: 아래 표 참고 |

## `action_failed` 세부 조건

| `action` 값 | 호출 조건 |
| --- | --- |
| `board_create` | 보드 생성 API 실패. 활성 보드 제한 오류는 제외한다. |
| `board_update` | 보드 수정 API 실패 |
| `board_delete` | 보드 삭제 API 실패 |
| `sticker_collect` | 스티커 수집 실패. 일일 제한 및 이미 완료된 보드 오류는 제외한다. |
| `onboarding_setup` | 온보딩 보드 및 프로필 저장 실패 |
| `notification_permission` | 온보딩 알림 권한 요청 또는 저장 과정에서 예외 발생 |
| `notification_toggle` | 설정 화면의 알림 상태 변경 작업 실패 |

## 호출 시점 참고사항

- `active_limit_reached`의 `client`는 생성 시트를 열기 전에 로컬 상태로 제한을 확인한 경우다.
- `active_limit_reached`의 `server`는 보드 생성 RPC가 활성 보드 제한 오류를 반환한 경우다.
- 화면 조회 이벤트는 `useTrackView` 내부 ref를 통해 같은 컴포넌트 인스턴스에서 한 번만 전송한다.
- `onboarding_step_completed`의 `notification` 단계는 보드 저장, 온보딩 완료 처리, 캐시 갱신이 끝난 뒤 전송한다.
- `notification_permission_result`는 알림을 활성화하면서 권한을 확인하는 흐름에서 전송한다. 알림 비활성화만 하는 경우에는 `notification_toggle`만 전송한다.
- 활성 보드 제한이나 스티커 일일 제한처럼 예상 가능한 정책 거절은 일반 `action_failed`로 기록하지 않는다.
- 보드 제목, 이모지, 보상 내용과 같은 사용자 입력 원문은 이벤트 속성으로 전송하지 않는다.
