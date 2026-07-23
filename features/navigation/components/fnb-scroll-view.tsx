import useFnbContentInset from "@/features/navigation/hooks/use-fnb-content-inset";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

const FnbScrollView = ({
  contentContainerStyle,
  ...props
}: ScrollViewProps) => {
  const fnbContentInset = useFnbContentInset();
  const paddingBottom = StyleSheet.flatten(contentContainerStyle)?.paddingBottom;
  const pageBottomPadding =
    typeof paddingBottom === "number" ? paddingBottom : 0;

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        contentContainerStyle,
        { paddingBottom: pageBottomPadding + fnbContentInset },
      ]}
    />
  );
};

export default FnbScrollView;
