import { ICONS, IconName } from "./registry";

type Props = {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
};

const Icon = ({ name, size = 24, width, height }: Props) => {
  const Svg = ICONS[name];

  return <Svg width={width || size} height={height || size} />;
};

export default Icon;
