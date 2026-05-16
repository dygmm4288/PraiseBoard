import { ICONS, IconName } from "./registry";
import type { SvgProps } from "react-native-svg";

type Props = SvgProps & {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
};

const Icon = ({ name, size = 24, width, height, ...props }: Props) => {
  const Svg = ICONS[name];

  return <Svg width={width || size} height={height || size} {...props} />;
};

export default Icon;
