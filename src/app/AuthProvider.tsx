import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { User as FirebaseUser, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink} from "firebase/auth";
import { auth } from "./firebase";
import { useRouter  } from "next/navigation"
import Cookies from 'js-cookie'
import { BASE_URL } from "./constants/urls";

type authStatus = "authenticated" | "unauthenticated" | "loading";

type User = {
  _id: string,
  email: string,
  role: string,
  group: string | null,
  surveyPreTrial: any,
  trial1: any,
  trial2: any,
  surveyPostTrial: any,
  quit: boolean
}

const AuthCtx = createContext<{
  sendAuthEmail(email: string): Promise<void>;
  verifyEmailLinkAndLogin(): Promise<boolean>;
  signOut(): void;
  status: authStatus;
  firebaseUser: FirebaseUser | null;
  user: User | null;
  refetchUser(): void;
  signup(email: string, password: string): Promise<void>;
}>({
    async sendAuthEmail(email: string) {},
    status: "loading",
    async verifyEmailLinkAndLogin() {
        return false;
    },
    signOut() {},
    firebaseUser: null,
    user: null,
    async refetchUser() {},
    async signup() {}
});

export const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<authStatus>("loading");
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()

  const signup = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}api/auth/signup`, { 
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

      if (!res.ok) {
        throw new Error('User not found')
      }

      window.localStorage.setItem('orphanFaceRecognitionStudyEmail', email);

      setStatus("authenticated")
      
    } catch(error: any) {
        console.log(error);
    }
  }

  const sendAuthEmail = async (email: string) => {
      // try {
      //     const res = await fetch(`${BASE_URL}api/auth/whitelist?email=${email}`)

      //     if (!res.ok) {
      //       throw new Error('User not found')
      //     }

      //     await sendSignInLinkToEmail(auth, email, {
      //         url: `${BASE_URL}signin-confirm`,
      //         handleCodeInApp: true
      //     })
      //     window.localStorage.setItem('orphanFaceRecognitionStudyEmail', email);
      // } catch(error: any) {
      //     console.log(error);
      // }
  };

  const verifyEmailLinkAndLogin = async () => {
      // const continueUrl = window.location.href;

      // try {
      //     const isValid = isSignInWithEmailLink(auth, continueUrl);
      //     if (!isValid) {
      //         return false;
      //     }

      //     const email = window.localStorage.getItem("orphanFaceRecognitionStudyEmail") as string;
      //     if (!email) {
      //         return false;
      //     }

      //     await signInWithEmailLink(auth, email, continueUrl);
          
      //     setStatus("authenticated");

      //     window.localStorage.removeItem("orphanFaceRecognitionStudyEmail");

      //     return true;
      // } catch (error) {
      //     console.log(error);
      //     setStatus("unauthenticated");

      //     return false;
      // }
      return false
  };

  const signOut = async () => { 
    await auth.signOut();
    Cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "");
    setUser(null)
    router.replace('/signin')
  }

  const fetchUser = async (email: string, firebaseUid: string) => {
    try {
      const res = await fetch(`${BASE_URL}api/users/current?email=${email}&firebaseUid=${firebaseUid}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`
        }
      })

      if (res.ok) {
        const currentUser = await res.json()
        setUser(currentUser)
        setStatus("authenticated");
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken()
        Cookies.set(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "", idToken, { sameSite: "strict" });
        fetchUser(user.email as string, auth.currentUser?.uid as string)
      } else { 
        setStatus("unauthenticated"); 
      }
    });
  }, [status]);

  return (
    <AuthCtx.Provider
      value={{
        sendAuthEmail,
        status,
        verifyEmailLinkAndLogin,
        firebaseUser: auth.currentUser,
        user: user ? user as User : null,
        signOut,
        signup,
        refetchUser: async () => fetchUser(user?.email as string, auth.currentUser?.uid as string)
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
export default AuthProvider;