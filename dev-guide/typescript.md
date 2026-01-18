# TypeScript (타입스크립트) 상세 가이드

## 1. 개요 (Overview)

TypeScript는 JavaScript에 **타입(Type)** 문법을 추가한 언어입니다.
게임 개발은 수많은 변수(체력, 공격력, 속도 등)를 다루므로, 타입스크립트를 사용하면 **버그를 획기적으로 줄일 수 있습니다.**

## 2. 핵심 문법 및 사용법

### 2.1. 변수 선언 (Type Annotation)

변수 뒤에 `: 타입`을 붙여서 의도를 명확히 합니다.

```typescript
// 캐릭터 이름 (문자열)
let characterName: string = "Hero";

// 캐릭터 레벨 (숫자)
let level: number = 1;

// 게임 종료 여부 (불리언)
let isGameOver: boolean = false;
```

### 2.2. 인터페이스 (Interface) - 가장 중요! ⭐

게임 내 오브젝트(캐릭터, 아이템)의 **모양(구조)**을 정의할 때 사용합니다. 코드를 짤 때 자동 완성이 되어 매우 편리합니다.

```typescript
// '플레이어'라는 데이터의 형태를 정의
interface PlayerState {
  id: string;
  hp: number;
  speed: number;
  inventory: string[]; // 문자열 배열
}

// 실제 데이터 생성
const myPlayer: PlayerState = {
  id: "user_123",
  hp: 100,
  speed: 200, // 여기에 문자를 넣으면 에러가 남!
  inventory: ["sword", "potion"],
};
```

### 2.3. 함수 (Function)

함수의 **입력값(Parameter)**과 **반환값(Return Type)**에도 타입을 지정합니다.

```typescript
// 데미지를 입히는 함수
// targetHp: 현재 체력, damage: 입을 피해량
// 반환값: 남은 체력 (number)
function takeDamage(targetHp: number, damage: number): number {
  return targetHp - damage;
}

let currentHp = 100;
currentHp = takeDamage(currentHp, 10); // 90
```

## 3. 우리 프로젝트에서의 활용 (Vibe Coding Tip)

- **복잡한 타입은 AI에게 맡기기**: "플레이어 스탯 인터페이스 짜줘"라고 하면 AI가 알아서 `interface`를 만들어줍니다.
- **any 타입 자제하기**: `let data: any`라고 쓰면 타입 체크를 포기하는 것입니다. 정말 급할 때가 아니면 쓰지 맙시다.
