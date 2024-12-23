export const shouldShowNavbar = (pathname: string): boolean => {
  const noNavbarPaths = ['/auth', '/complete-profile'];
  return !noNavbarPaths.some(path => pathname.startsWith(path));
};
