import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const NavigationContext = createContext<{
    showQuitDialog: boolean;
    toggleQuitDialog: (value: boolean) => void;
    stepIndex: number;
    proceed(): void;
}>({
    showQuitDialog: false,
    toggleQuitDialog() {},
    stepIndex: 0,
    proceed() {}
});

export const useNavigationContext = () => useContext(NavigationContext);

const NavigationProvider = ({ children }: PropsWithChildren<{}>) => {
    const { user } = useAuth()

    const [stepIndex, setStepIndex] = useState(0)
    const [showQuitDialog, setShowQuitDialog] = useState(false)

    useEffect(() => {
        if (user) {
            setStepIndex(user.step)
        }
    }, [user])

    const proceed = () => {
        // TO DO: SAVE STEP INDEX TO API, THEN SET STATE IN CALLBACK
        setStepIndex(prevStepIndex => prevStepIndex + 1)
    };

    return (
        <NavigationContext.Provider
            value={{
                stepIndex,
                proceed,
                toggleQuitDialog: (value: boolean) => setShowQuitDialog(value),
                showQuitDialog: showQuitDialog,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
export default NavigationProvider;