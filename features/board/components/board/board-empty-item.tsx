import { AppButton, AppText } from "@/shared/ui";
import { View } from "react-native";
import { useNavigate } from "storybook/internal/router";

const BoardEmptyItem = () => {
  const navigate = useNavigate();

  const gotoNewBoard = () => {
    navigate("/boards/create");
  };

  return (
    <View>
      <AppText>텅</AppText>
      <AppText>새로운 습관을 다시 시작해봐요!</AppText>
      <AppButton onPress={gotoNewBoard}> + 새로운 습관 추가하기</AppButton>
    </View>
  );
};

export default BoardEmptyItem;
