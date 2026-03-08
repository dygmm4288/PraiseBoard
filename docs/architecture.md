📄 프로젝트 아키텍처 & 폴더 구조 규칙

# 프로젝트 아키텍처 규칙서

이 문서는 이 프로젝트에서 사용하는 **폴더 구조와 아키텍처 규칙**을 설명한다.

목표는 다음과 같다.

- 코드 책임 분리
- 확장 가능한 구조 유지
- 의존 방향 명확화
- 기능(feature) 간 결합 최소화

이 문서는 **미래의 나 자신을 위한 규칙서**이며,  
새로운 코드를 작성할 때 항상 참고해야 한다.

---

# 전체 아키텍처 구조

프로젝트는 다음 레이어로 구성된다.

features
↓
services
↓
entities
↓
infra
↓
features
↓
shared

각 레이어의 역할은 다음과 같다.

| 레이어   | 역할                         |
| -------- | ---------------------------- |
| features | UI 기능(feature)             |
| services | 비즈니스 로직 / use-case     |
| entities | 도메인 모델                  |
| infra    | 외부 시스템 (DB, storage 등) |
| shared   | 공용 유틸 및 UI              |

---

# 전체 폴더 구조

src
├ app
├ assets
├ docs
├ entities
├ features
├ infra
├ shared
├ scripts
└ services

---

# app

app/

Expo Router 기반의 **라우팅 및 레이아웃**을 담당한다.

예:

app/(tabs)/index.tsx
app/(onboarding)/onboard.tsx

이 레이어는 다음만 담당한다.

- 라우팅
- 화면 레이아웃
- navigation 설정

여기에는 **비즈니스 로직을 넣지 않는다.**

---

# features

features/

각 기능(feature) 단위로 코드를 분리한다.

예:

features/onboarding
├ components
├ hooks
├ schemas
├ types
└ screens

feature는 하나의 **작은 애플리케이션**처럼 구성된다.

feature 내부에는 다음이 들어갈 수 있다.

- UI 컴포넌트
- hooks
- feature 전용 타입
- feature 전용 schema

---

## feature 규칙

feature는 다음 레이어를 사용할 수 있다.

features → services
features → shared
features → entities

하지만 다음 의존은 금지한다.

features → features

즉 feature 간 직접 의존을 만들지 않는다.

---

# services

services/

서비스 레이어는 **비즈니스 로직과 use-case**를 담당한다.

예:

services/user
├ user.interface.ts
├ user.repository.supabase.ts
└ UserProvider.tsx

서비스는 다음 역할을 수행한다.

- 데이터 접근
- 여러 entity 조합
- 비즈니스 로직 실행
- repository 호출

UI는 **직접 repository를 호출하지 않고 반드시 services를 통해 접근한다.**

---

# entities

entities/

도메인 모델을 정의하는 레이어이다.

예:

entities/board
├ board.schema.ts
├ board.types.ts
└ index.ts

entities에는 다음이 들어간다.

- domain types
- validation schema
- domain constants

entities는 **비즈니스 모델 정의만 담당**한다.

entities는 다음을 의존하지 않는다.

entities → services
entities → features

---

# infra

infra/

외부 시스템과의 연결을 담당한다.

예:

infra/db
infra/storage

여기에는 다음이 들어간다.

- database schema
- storage adapter
- API client
- persistence 구현

infra는 **features에 의존하지 않는다.**

---

# shared

shared/

프로젝트 전체에서 사용하는 공용 코드이다.

구조:

shared
├ ui
├ components
├ hooks
├ utils
├ lib
├ types

---

## shared/ui

UI 프리미티브 컴포넌트.

예:

Button
Input
Text
Icon
Screen

이 컴포넌트들은 **도메인에 의존하지 않는다.**

---

## shared/components

여러 UI를 조합한 **재사용 가능한 컴포넌트**.

예:

Stepper
StepDots
InputButton

---

# UI 컴포넌트 규칙

UI는 두 가지 종류로 나뉜다.

### 1️⃣ UI Primitive

위치:

shared/ui

예:

Button
Input
Text
Icon

특징:

- 모든 feature에서 사용 가능
- 도메인 의존 없음

---

### 2️⃣ Feature Component

위치:

features//components

예:

features/onboarding/components/chat/chat-bubble.tsx

특징:

- 특정 feature 전용
- shared에 두지 않는다

---

# 의존 규칙

허용되는 의존:

features → services
features → shared
services → entities
services → infra

금지되는 의존:

features → features
entities → services
entities → features
infra → features

---

# 네이밍 규칙

### entity

board.schema.ts
board.types.ts

### service

user.repository.supabase.ts
user.service.ts

### component

chat-bubble.tsx
chat-input.tsx

---

# 새로운 feature 생성 기준

다음 조건이 있으면 feature를 만든다.

- 별도의 UI 흐름
- 별도의 상태
- 별도의 비즈니스 로직

예:

board
sticker
notification
profile

---

# 아키텍처 원칙

이 프로젝트는 다음 원칙을 따른다.

### 1. Feature Isolation

각 feature는 서로 독립적이어야 한다.

---

### 2. Domain 중심 설계

핵심 비즈니스 모델은 `entities`에 정의한다.

---

### 3. 의존 방향 명확화

상위 레이어가 하위 레이어에 의존한다.

---

### 4. UI와 도메인 로직 분리

UI는 features에  
도메인 로직은 entities에 둔다.

---

# 미래 확장 예시

프로젝트가 확장되면 다음 구조가 된다.

features
├ onboarding
├ board
├ profile
└ notifications

services
├ user
├ board
└ sticker

entities
├ user
├ board
└ sticker

---

# 코드 작성 전 체크리스트

새 코드를 작성할 때 항상 질문한다.

이 코드는 UI인가?
이 코드는 도메인 로직인가?
이 코드는 인프라 코드인가?

답에 따라 적절한 레이어에 배치한다.
