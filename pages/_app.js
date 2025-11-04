import "../styles/globals.css";
import { AuthProvider } from "@/lib/auth";
import { useAuth } from "@/lib/auth";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AuthProvider>
  );
}

const AuthGuard = ({ children }) => {
  const { ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  return children;
};

export default MyApp;
