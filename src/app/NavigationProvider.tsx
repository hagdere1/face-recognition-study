import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

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

    useEffect(() => {
        if (user) {
            setStepIndex(user.step)
        }
    }, [user])

    const proceed = () => {
        // TO DO: SAVE STEP INDEX TO API, THEN SET STATE IN CALLBACK
        setStepIndex(prevStepIndex => prevStepIndex + 1)
    };
    
    const quit = async () => {
        try {
            await fetch(`http://localhost:3000/api/users/${user?._id}/quit`, {
                method: 'PUT',
                // headers: {
                //     'Content-type': 'application/json'
                // },
                // body: JSON.stringify(member)
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