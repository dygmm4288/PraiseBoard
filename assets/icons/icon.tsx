import { ICONS } from ".";

type Props = {
  name: keyof typeof ICONS;
  size?: number;
};

const Icon = ({ name, size = 24 }: Props) => {
  const Svg = ICONS[name];

  return <Svg width={size} height={size} />;
};

export default Icon;
