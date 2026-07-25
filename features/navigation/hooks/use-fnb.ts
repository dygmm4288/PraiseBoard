import { ICONS } from "@/assets/icons";
import {
  FNB_PATHS,
  getFnbParentKey,
} from "@/features/navigation/constants/fnb-paths";
import { type Href, usePathname, useRouter } from "expo-router";
import { useMemo } from "react";

export type FnbKey = keyof typeof FNB_PATHS;
export type FnbItem = {
  key: FnbKey;
  icon: React.ReactNode;
  label: string;
};

const pathMap = FNB_PATHS satisfies Record<FnbKey, Href>;

const mapPathnameToKey = (pathName: string): FnbKey => {
  const parentKey = getFnbParentKey(pathName);
  if (parentKey) return parentKey;

  const entry = Object.entries(pathMap).find(([, value]) =>
    value === "/" ? pathName === value : pathName.startsWith(value),
  );

  return (entry?.[0] as FnbKey) ?? "home";
};

export const useFnb = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = useMemo(
    () => [
      { key: "home" as const, label: "홈", icon: ICONS.Home },
      { key: "stats" as const, label: "통계", icon: ICONS.Chart },
      { key: "archives" as const, label: "보관함", icon: ICONS.Folder },
      { key: "setting" as const, label: "설정", icon: ICONS.Setting },
    ],
    [],
  );

  const activeKey = mapPathnameToKey(pathname);

  const onPress = (key: FnbKey) => {
    const target = pathMap[key];
    if (target === pathname) return; // no-op if same screen

    router.replace(target);
  };

  return { items, activeKey, onPress };
};
