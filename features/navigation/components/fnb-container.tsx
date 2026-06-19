import Fnb from "@/shared/ui/fnb";
import FnbFloatingAction from "./fnb-floating-action";
import useFloatingAction from "../hooks/use-floating-action";
import { useFnb } from "../hooks/use-fnb";

const FnbContainer = () => {
  const { items, activeKey, onPress } = useFnb();
  const { isVisible: isFloatingActionVisible, onPressCreate } =
    useFloatingAction();

  return (
    <>
      {isFloatingActionVisible && (
        <FnbFloatingAction onPress={onPressCreate} />
      )}
      <Fnb items={items} activeKey={activeKey} onPress={onPress} />
    </>
  );
};

export default FnbContainer;
