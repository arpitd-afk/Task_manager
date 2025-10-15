import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated } from "../lib/auth";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ["/auth/login", "/auth/signup"];
    if (!isAuthenticated() && !publicPaths.includes(router.pathname)) {
      router.push("/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
