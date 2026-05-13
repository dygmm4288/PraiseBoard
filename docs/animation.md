# Animation Guide

이 문서는 React Native Reanimated 애니메이션을 다룰 때 헷갈리기 쉬운 개념을 PraiseBoard의 FNB 사례 기준으로 정리한다.

## 기본 모델

Reanimated에서는 보통 세 단계로 애니메이션을 만든다.

1. `useSharedValue`로 애니메이션 값을 만든다.
2. `useAnimatedStyle`에서 그 값을 UI 스타일로 변환한다.
3. 이벤트나 상태 변화에서 `withTiming`, `withSpring` 등으로 값을 변경한다.

예시:

```tsx
const progress = useSharedValue(0);

const style = useAnimatedStyle(() => ({
  opacity: progress.value,
}));

useEffect(() => {
  progress.value = withTiming(isActive ? 1 : 0, { duration: 180 });
}, [isActive, progress]);
```

`progress.value`는 일반 React state와 다르게 UI thread에서 움직인다. 그래서 매 프레임 React render를 다시 돌리지 않고도 부드럽게 움직일 수 있다.

## withTiming

`withTiming`은 정해진 시간 동안 A에서 B로 이동한다.

```ts
value.value = withTiming(1, { duration: 180 });
```

특징:

- duration이 명확하다.
- 반동이 없다.
- 버튼 opacity, 짧은 fade, 단순 scale에 적합하다.
- 너무 길면 느릿하게 보이고, 너무 짧으면 튀어 보인다.

사용하기 좋은 경우:

- opacity 변경
- 색상 전환
- 살짝 작아졌다 커지는 시작 동작
- 정확한 시간 제어가 필요한 micro interaction

## withSpring

`withSpring`은 물리 기반으로 목표값까지 이동한다.

```ts
value.value = withSpring(100, {
  damping: 22,
  stiffness: 160,
  mass: 1.1,
});
```

특징:

- duration을 직접 정하지 않는다.
- 값이 목적지에 가까워질 때 자연스럽게 감속한다.
- 설정에 따라 튕김이 생길 수 있다.
- floating surface, draggable UI, active capsule 이동에 적합하다.

## Spring 옵션

`damping`은 흔들림을 줄이는 마찰이다.

- 낮을수록 더 통통 튄다.
- 높을수록 빨리 멈춘다.
- FNB처럼 차분한 floating UI는 대략 `18~30` 사이에서 시작한다.

`stiffness`는 목적지로 끌어당기는 힘이다.

- 낮을수록 느리고 부드럽다.
- 높을수록 빠르고 단단하다.
- 너무 높으면 딱딱한 indicator처럼 보인다.

`mass`는 움직이는 물체의 무게감이다.

- 낮을수록 가볍고 빠르다.
- 높을수록 묵직하고 늦게 반응한다.
- floating capsule은 `0.8~1.2` 정도가 무난하다.

## FNB 원칙

FNB는 Material indicator가 아니라 active capsule 자체가 이동하는 느낌을 목표로 한다.

유지할 것:

- active surface는 별도 컴포넌트로 둔다.
- item별 icon/label animation은 `FnbItem` 내부에서 소유한다.
- active surface width는 container width와 item count로 계산한다.
- 탭을 누르면 라우팅 완료를 기다리지 말고 visual active state를 먼저 바꾼다.

피할 것:

- `items.map` 내부에서 hook 호출
- 고정 active width
- indicator width animation
- 과한 squash/stretch
- `withSequence`를 많이 쌓아서 시작이 멈칫해지는 구조

## 추천 패턴

작아졌다 커지는 효과는 `withTiming`으로 빠르게 시작하고, 복원은 `withSpring`으로 처리한다.

```ts
scale.value = withSequence(
  withTiming(0.9, { duration: 80 }),
  withSpring(1, {
    damping: 18,
    stiffness: 150,
    mass: 0.9,
  }),
);
```

이동은 `withSpring`을 쓴다.

```ts
translateX.value = withSpring(nextX, {
  damping: 24,
  stiffness: 130,
  mass: 1,
});
```

두 애니메이션을 같은 이벤트에서 동시에 시작하면 멈칫함이 줄어든다. 반대로 scale이 완전히 끝난 뒤 이동을 시작하면 사용자는 delay처럼 느낀다.

## 튜닝 기준

느낌이 너무 빠르면:

- `stiffness`를 낮춘다.
- `mass`를 조금 올린다.

느낌이 너무 튀면:

- `damping`을 올린다.

느낌이 너무 딱딱하면:

- `stiffness`를 낮춘다.
- active surface shadow와 opacity를 부드럽게 조정한다.

누른 뒤 멈칫하면:

- 라우팅 상태를 기다리는지 확인한다.
- visual active state를 먼저 업데이트한다.
- `withDelay`나 긴 첫 `withTiming` 구간을 제거한다.

## 현재 FNB 구조

```txt
Fnb
 ├─ ActiveSurface
 └─ FnbItem[]
```

`Fnb`는 layout과 active 위치 계산만 담당한다.

`ActiveSurface`는 capsule 이동과 surface scale을 담당한다.

`FnbItem`은 active/inactive 상태에 따른 icon, label animation을 담당한다.
