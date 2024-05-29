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
  signOut(): void;
  status: authStatus;
  user: User | null;
  refetchUser(): void;
  signup(email: string, password: string): Promise<void>;
  signin(email: string, password: string): Promise<void>;
}>({
    status: "loading",
    signOut() {},
    user: null,
    async refetchUser() {},
    async signup() {},
    async signin() {},
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
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

      if (!res.ok) {
        throw new Error('User not found')
      }

      await fetchUser()
      setStatus("authenticated")
      
    } catch(error: any) {
        console.log(error);
    }
  }

  const signin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}api/auth/signin`, { 
        method: 'POST', 
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        throw new Error('User not found')
      }

      await fetchUser()
      setStatus("authenticated")
      
    } catch(error: any) {
        console.log(error);
        alert('Invalid email or password')
    }
  }

  const signOut = async () => { 
    await fetch(`${BASE_URL}api/auth/signout`)
    setUser(null)
    setStatus('unauthenticated')
    router.replace('/signin')
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/users/current`)

      if (res.ok) {
        const currentUser = await res.json()
        setUser(currentUser)
      } else {
        router.replace('/signin')
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [status])

  return (
    <AuthCtx.Provider
      value={{
        status,
        user: user ? user as User : null,
        signOut,
        signup,
        signin,
        refetchUser: async () => fetchUser()
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
export default AuthProvider;