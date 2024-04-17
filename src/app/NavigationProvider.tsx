import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";
import Cookies from 'js-cookie'
import { BASE_URL } from "./constants/urls";

const NavigationContext = createContext<{
    showQuitDialog: boolean;
    toggleQuitDialog: (value: boolean) => void;
    stepIndex: number;
    proceed(): void;
    quit(): void
}>({
    showQuitDialog: false,
    toggleQuitDialog() {},
    stepIndex: 0,
    proceed() {},
    quit() {}
});

export const useNavigationContext = () => useContext(NavigationContext);

const NavigationProvider = ({ children }: PropsWithChildren<{}>) => {
    const { user, refetchUser } = useAuth()

    const [stepIndex, setStepIndex] = useState(0)
    const [showQuitDialog, setShowQuitDialog] = useState(false)

    const proceed = () => {
        setStepIndex(prevStepIndex => prevStepIndex + 1)
    };
    
    const quit = async () => {
        try {
            await fetch(`${BASE_URL}api/users/${user?._id}/quit`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`
                }
            })
        } catch (err) {
            console.log(err)
        }
        setShowQuitDialog(false)
        refetchUser()
    }

    return (
        <NavigationContext.Provider
            value={{
                stepIndex,
                proceed,
                toggleQuitDialog: (value: boolean) => setShowQuitDialog(value),
                showQuitDialog: showQuitDialog,
                quit
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
export default NavigationProvider;