export const FNB_PATHS = {
  home: "/",
  stats: "/stats",
  archives: "/archives",
  setting: "/settings",
} as const;

type FnbKey = keyof typeof FNB_PATHS;

const FNB_CHILD_PATHS = {
  "/debug-settings": "setting",
} as const satisfies Record<string, FnbKey>;

export const isFnbRootPathname = (pathname: string) =>
  Object.values(FNB_PATHS).includes(
    pathname as (typeof FNB_PATHS)[keyof typeof FNB_PATHS],
  );

export const getFnbParentKey = (pathname: string): FnbKey | null =>
  FNB_CHILD_PATHS[pathname as keyof typeof FNB_CHILD_PATHS] ?? null;

export const isFnbVisiblePathname = (pathname: string) =>
  isFnbRootPathname(pathname) || getFnbParentKey(pathname) !== null;
