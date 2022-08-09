import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStoreLocal, useAuth } from "./auth";

const AuthenticatedRoute = ({ children, pathAfterFailure }: any) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checkUser, setCheckUser] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const token = getStoreLocal("id");
    authCheck(router.asPath, token);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [checkUser]);

  useEffect(() => {
    if (user) setCheckUser(true);
  }, [user]);

  const hideContent = () => {
    if (checkUser) return;
    setAuthorized(false);
  };

  function authCheck(url: any, token: any) {
    const path = url.split("?")[0];
    if (!token && path != pathAfterFailure) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
      });
    } else {
      setAuthorized(true);
    }
  }
  return authorized && children;
};

export default AuthenticatedRoute;
