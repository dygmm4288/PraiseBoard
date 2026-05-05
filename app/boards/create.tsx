import BoardCreate from "@/features/board/components/board-create/board-create";
import { Screen } from "@/shared/ui";

export default function BoardCreateRoute() {
  return (
    <Screen className="bg-white px-[20px] pb-[20px] pt-[68px]">
      <BoardCreate />
    </Screen>
  );
}
