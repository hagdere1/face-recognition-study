import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

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