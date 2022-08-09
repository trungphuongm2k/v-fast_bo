import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import AuthenticatedRoute from "../contexts/authenticatedRoute";
import { AuthProvider } from "../contexts/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <AuthenticatedRoute pathAfterFailure={"/login"}>
          <Navbar />
          <div style={{ marginLeft: "70px" }}>
            <Header />
            <Component {...pageProps} />
          </div>
        </AuthenticatedRoute>
      </AuthProvider>
    </>
  );
}

export default MyApp;
