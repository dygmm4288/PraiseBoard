import { Skeleton } from "@/shared/ui";
import { View } from "react-native";

const BoardListSkeleton = () => {
  return (
    <View
      accessibilityLabel="보드 목록을 불러오는 중"
      accessibilityRole="progressbar"
      className="gap-[12px]"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <View
          key={`board-skeleton-${index}`}
          className="h-[96px] flex-row items-center gap-[11px] rounded-[20px] bg-white px-[16px] py-[14px]"
        >
          <Skeleton width={40} height={40} borderRadius={13} />
          <View className="flex-1 gap-[7px]">
            <Skeleton width={52} height={16} borderRadius={8} />
            <Skeleton width="68%" height={16} borderRadius={8} />
            <Skeleton width="44%" height={14} borderRadius={7} />
          </View>
          <Skeleton width={34} height={34} borderRadius={17} />
        </View>
      ))}
    </View>
  );
};

export default BoardListSkeleton;
