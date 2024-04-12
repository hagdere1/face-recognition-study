import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { User as FirebaseUser, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink} from "firebase/auth";
import { auth } from "./firebase";

type authStatus = "authenticated" | "unauthenticated" | "loading";

type User = {
  _id: string,
  email: string,
  role: string,
  group: string | null,
  surveyPreTrial: any,
  trial1: any,
  trial2: any,
  surveyPostTrial: any
}

const AuthCtx = createContext<{
  sendAuthEmail(email: string): Promise<void>;
  verifyEmailLinkAndLogin(): Promise<boolean>;
  signOut(): void;
  status: authStatus;
  firebaseUser: FirebaseUser | null;
  user: User | null
}>({
    async sendAuthEmail(email: string) {},
    status: "loading",
    async verifyEmailLinkAndLogin() {
        return false;
    },
    signOut() {},
    firebaseUser: null,
    user: null
});

export const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
    const [status, setStatus] = useState<authStatus>("loading");
    const [user, setUser] = useState<User | null>(null)

    const sendAuthEmail = async (email: string) => {
        try {
            await sendSignInLinkToEmail(auth, email, {
                url: 'http://localhost:3000/signin-confirm',
                handleCodeInApp: true
            })
            window.localStorage.setItem('orphanFaceRecognitionStudyEmail', email);
            alert("A sign-in link has been sent to your email.")
        } catch(error: any) {
            console.log(error);
        }
    };

    const verifyEmailLinkAndLogin = async () => {
        const continueUrl = window.location.href;

        try {
            const isValid = isSignInWithEmailLink(auth, continueUrl);
            if (!isValid) {
                return false;
            }

            const email = window.localStorage.getItem("orphanFaceRecognitionStudyEmail") as string;
            if (!email) {
                return false;
            }

            await signInWithEmailLink(auth, email, continueUrl);
            
            setStatus("authenticated");

            window.localStorage.removeItem("orphanFaceRecognitionStudyEmail");

            return true;
        } catch (error) {
            console.log(error);
            setStatus("unauthenticated");

            return false;
        }
    };

  const signOut = async () => { 
    await auth.signOut();
    setUser(null)
  }

  const fetchUser = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/current?email=${email}`)

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
    onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchUser(user.email || "")
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
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
export default AuthProvider;