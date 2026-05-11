import { AppText, Screen } from "@/shared/ui";
import { useLocalSearchParams } from "expo-router";

const ArchiveDetailScreen = () => {
  const params = useLocalSearchParams();
  return (
    <Screen>
      <AppText>{params.id}</AppText>
    </Screen>
  );
};

export default ArchiveDetailScreen;
