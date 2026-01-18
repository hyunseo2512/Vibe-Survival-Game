# Phaser 3 (페이저) 상세 가이드

## 1. 개요 (Overview)

Phaser는 웹에서 돌아가는 **2D 게임 엔진**입니다.
`HTML5 Canvas` 기술을 사용하여 그래픽을 고속으로 렌더링합니다. 설치가 필요 없고 브라우저만 있으면 실행됩니다.

## 2. 핵심 구조: 씬(Scene)의 생명주기

Phaser 게임은 여러 개의 **Scene(장면)**으로 이루어집니다. 각 Scene은 아래 3단계 함수를 자동으로 실행합니다.

### 2.1. preload() : 리소스 로딩

게임에 필요한 이미지, 소리, 데이터를 메모리에 미리 불러옵니다.

```typescript
preload() {
    // 'player'라는 이름으로 이미지 파일을 로드
    this.load.image('player', 'assets/player.png');
    this.load.image('ground', 'assets/ground.png');
}
```

### 2.2. create() : 화면 배치

로딩이 끝나면 딱 한 번 실행됩니다. 물체를 화면에 꺼내놓는 단계입니다.

```typescript
create() {
    // 배경 추가
    this.add.image(400, 300, 'bg');

    // 플레이어 스프라이트 생성 (물리 적용)
    // this.physics.add.sprite(x좌표, y좌표, '이미지키');
    player = this.physics.add.sprite(100, 450, 'player');

    // 점프력 설정
    player.setBounce(0.2);
    player.setCollideWorldBounds(true); // 화면 밖으로 못 나가게
}
```

### 2.3. update() : 게임 루프 (무한 반복)

매 프레임(초당 60회)마다 실행됩니다. 키보드 입력을 확인하거나 움직임을 처리합니다.

```typescript
update() {
    // 왼쪽 키를 누르면
    if (cursors.left.isDown) {
        player.setVelocityX(-160); // 왼쪽으로 이동
    }
    // 오른쪽 키를 누르면
    else if (cursors.right.isDown) {
        player.setVelocityX(160); // 오른쪽으로 이동
    }
    // 아무것도 안 누르면
    else {
        player.setVelocityX(0); // 정지
    }
}
```

## 3. 주요 기능 설명

### 👾 Sprite (스프라이트)

- 게임 내의 모든 '움직이는 그림'입니다.
- 위치(`x`, `y`), 크기(`scale`), 회전(`rotation`) 등을 조절할 수 있습니다.

### 🍎 Physics (Arcade Physics)

- Phaser의 기본 물리 엔진입니다.
- **중력(Gravity)**, **속도(Velocity)**, **충돌(Collider)**을 다룹니다.
- `this.physics.add.collider(player, ground)` 한 줄이면 플레이어가 땅 위에 서 있게 됩니다.

### 🎥 Camera (카메라)

- 게임 세상을 비추는 카메라입니다.
- `this.cameras.main.startFollow(player)`를 쓰면 카메라가 플레이어를 따라다닙니다.
