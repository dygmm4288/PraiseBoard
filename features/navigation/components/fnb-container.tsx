import Fnb from "@/shared/ui/fnb";
import { useFnb } from "../hooks/use-fnb";

const FnbContainer = () => {
  const { items, activeKey, onPress } = useFnb();

  return <Fnb items={items} activeKey={activeKey} onPress={onPress} />;
};

export default FnbContainer;
