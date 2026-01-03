"use client";
// Simplified AuthRouter - no authentication needed
// Just a pass-through component since no one will be logging in
const AuthRouter = (props: any) => {
  // Simply render children - no auth logic needed
  return <>{props.children}</>;
};

export default AuthRouter;
