import { ICONS, IconName } from "./registry";

type Props = {
  name: IconName;
  size?: number;
};

const Icon = ({ name, size = 24 }: Props) => {
  const Svg = ICONS[name];

  return <Svg width={size} height={size} />;
};

export default Icon;
