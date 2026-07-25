import { Skeleton } from "@/shared/ui";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

const DetailCard = ({ children }: PropsWithChildren) => (
  <View className="rounded-[20px] bg-white px-[20px] py-[16px]">{children}</View>
);

const ArchiveDetailSkeleton = () => {
  return (
    <View
      accessibilityLabel="보드 상세 정보를 불러오는 중"
      accessibilityRole="progressbar"
      className="gap-[12px]"
    >
      <DetailCard>
        <View className="flex-row items-center gap-[12px] border-b border-line-subtle pb-[16px]">
          <Skeleton width={40} height={40} borderRadius={13} />
          <View className="flex-1 gap-[7px]">
            <Skeleton width="56%" height={16} />
            <Skeleton width="42%" height={14} />
          </View>
          <Skeleton width={42} height={24} />
        </View>
        <View className="gap-[12px] pt-[16px]">
          <View className="flex-row justify-between">
            <Skeleton width={42} height={14} />
            <Skeleton width={96} height={14} />
          </View>
          <View className="flex-row justify-between">
            <Skeleton width={58} height={14} />
            <Skeleton width={124} height={14} />
          </View>
        </View>
      </DetailCard>

      <DetailCard>
        <View className="items-center gap-[18px]">
          <Skeleton width={112} height={18} />
          <View className="w-full flex-row justify-between">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={`calendar-label-${index}`} width={20} height={12} />
            ))}
          </View>
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <View
              key={`calendar-row-${rowIndex}`}
              className="w-full flex-row justify-between"
            >
              {Array.from({ length: 7 }, (_, columnIndex) => (
                <Skeleton
                  key={`calendar-cell-${rowIndex}-${columnIndex}`}
                  width={28}
                  height={28}
                  borderRadius={14}
                />
              ))}
            </View>
          ))}
        </View>
      </DetailCard>

      <View className="h-[75px] flex-row items-center justify-between rounded-[14px] bg-primary-100 px-[20px]">
        <Skeleton width={64} height={16} />
        <View className="flex-row items-center gap-[12px]">
          <Skeleton width={44} height={24} />
          <Skeleton width={34} height={34} borderRadius={17} />
        </View>
      </View>

      <DetailCard>
        <View className="gap-[14px]">
          {Array.from({ length: 2 }, (_, index) => (
            <View
              key={`summary-row-${index}`}
              className="flex-row justify-between"
            >
              <Skeleton width={62} height={14} />
              <Skeleton width={96} height={14} />
            </View>
          ))}
        </View>
      </DetailCard>

      <DetailCard>
        <View className="mb-[24px] flex-row justify-between">
          <Skeleton width={64} height={16} />
          <Skeleton width={42} height={24} />
        </View>
        <View className="gap-[5px]">
          {Array.from({ length: 3 }, (_, rowIndex) => (
            <View
              key={`progress-row-${rowIndex}`}
              className="flex-row justify-between"
            >
              {Array.from({ length: 10 }, (_, columnIndex) => (
                <Skeleton
                  key={`progress-cell-${rowIndex}-${columnIndex}`}
                  width={28}
                  height={28}
                  borderRadius={6}
                />
              ))}
            </View>
          ))}
        </View>
      </DetailCard>
    </View>
  );
};

export default ArchiveDetailSkeleton;
