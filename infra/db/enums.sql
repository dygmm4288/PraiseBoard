-- 보드 상태: 진행 중, 완료
create type board_status as enum ('active', 'completed');

-- 스티커 출처: 앱 내부, 위젯
create type sticker_source as enum ('app', 'widget');
