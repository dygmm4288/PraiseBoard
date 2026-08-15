import { z } from "zod";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean
>;

export const onboardingStepSchema = z.enum([
  "name",
  "title",
  "reward",
  "limit",
  "limitCount",
  "notification",
]);

export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

export const analyticsActionSchema = z.enum([
  "board_create",
  "board_update",
  "board_delete",
  "sticker_collect",
  "onboarding_setup",
  "notification_permission",
  "notification_toggle",
]);

export type AnalyticsAction = z.infer<typeof analyticsActionSchema>;

const boardIdSchema = z.string().min(1);
const pushPropertiesSchema = z.object({
  push_type: z.string().min(1),
  push_id: z.string().min(1),
});

/**
 * 분석 이벤트 이름과 payload의 단일 계약이다.
 * 새 이벤트나 속성은 이 registry에 먼저 추가하고, 기능 코드는 domain facade만 호출한다.
 *
 * TODO(GMP-112)
 * - board_category: 제품의 category 입력/enum/저장 기능이 생긴 뒤 board_created에 추가한다.
 * - triggered_by_limit: 한도 도달에서 삭제로 이어지는 제품 경로가 생긴 뒤 board_deleted에 추가한다.
 */
export const analyticsEventSchemas = {
  app_opened: z.object({ days_since_install: z.number().int().nonnegative() }),
  board_created: z.object({
    source: z.enum(["board_create", "onboarding"]),
    board_id: boardIdSchema,
    target_count: z.number().int().positive(),
    is_first_board: z.boolean(),
  }),
  board_updated: z.object({ board_id: boardIdSchema }),
  board_deleted: z.object({
    board_id: boardIdSchema,
    progress_at_deletion: z.number().int().min(0).max(100),
  }),
  board_delete_cancelled: z.object({ board_id: boardIdSchema }),
  sticker_collected: z.object({
    source: z.enum(["app", "widget"]),
    board_id: boardIdSchema,
    current_progress: z.number().int().min(0).max(100),
    is_first_check: z.boolean(),
  }),
  board_completed: z.object({
    board_id: boardIdSchema,
    total_days_taken: z.number().int().positive(),
  }),
  active_limit_reached: z.object({ source: z.enum(["client", "server"]) }),
  board_edit_started: z.undefined(),
  stats_viewed: z.undefined(),
  archive_viewed: z.undefined(),
  detail_viewed: z.undefined(),
  onboarding_started: z.undefined(),
  onboarding_step_completed: z.object({ step: onboardingStepSchema }),
  notification_toggle: z.object({
    requested_enabled: z.boolean(),
    result_enabled: z.boolean(),
    permission_status: z.enum(["granted", "denied", "undetermined"]),
  }),
  notification_permission_result: z.object({
    status: z.enum(["granted", "denied", "undetermined"]),
  }),
  push_received: pushPropertiesSchema,
  push_clicked: pushPropertiesSchema,
  action_failed: z.object({ action: analyticsActionSchema }),
} as const;

export type AnalyticsEventMap = {
  [EventName in keyof typeof analyticsEventSchemas]: z.infer<
    (typeof analyticsEventSchemas)[EventName]
  >;
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

type TrackEventArguments<EventName extends AnalyticsEventName> =
  AnalyticsEventMap[EventName] extends undefined
    ? [properties?: undefined]
    : [properties: AnalyticsEventMap[EventName]];

export type TrackEvent = <EventName extends AnalyticsEventName>(
  eventName: EventName,
  ...args: TrackEventArguments<EventName>
) => Promise<void>;
