export const FNB_PATHS = {
  home: "/",
  stats: "/stats",
  archives: "/archives",
  setting: "/settings",
} as const;

export const isFnbRootPathname = (pathname: string) =>
  Object.values(FNB_PATHS).includes(
    pathname as (typeof FNB_PATHS)[keyof typeof FNB_PATHS],
  );
