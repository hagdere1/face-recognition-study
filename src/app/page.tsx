'use client'
import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import LoggedInRoutes from "./components/LoggedInRoutes";

export function AuthManager({ children }: { children: ReactNode | ReactNode[] }) {
  const { status } = useAuth();

  const router = useRouter();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }
  
  return <>{children}</>;
}

export default function App () {
  return (
    <AuthManager>
      <LoggedInRoutes />
    </AuthManager>
  )
}