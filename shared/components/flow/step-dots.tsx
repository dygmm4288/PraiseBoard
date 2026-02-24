import { View } from "react-native";

type Props = {
  total: number;
  current: number;
};
const StepDots = ({ total, current }: Props) => {
  return (
    <View className='flex-row items-center justify-center gap-2'>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={
            i === current
              ? "h-2 w-2 rounded-full bg-black"
              : "h-2 w-2 rounded-full bg-gray-300"
          }></View>
      ))}
    </View>
  );
};

export default StepDots;
