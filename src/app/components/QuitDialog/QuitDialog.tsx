import { useNavigationContext } from "@/app/NavigationProvider";
import { Button, Dialog } from "@mui/material";

type QuitDialog = {
    confirm: () => void,
    isOpen: boolean
}

export default function QuitDialog({ confirm, isOpen }: QuitDialog) {
    const { toggleQuitDialog } = useNavigationContext()

    return (
        <Dialog open={isOpen}>
            <div style={{ padding: 36 }}>
                <p>You have selected no. Are you unable to continue the study?</p>
                <br />
                <p>Note: If you answer yes, you can no longer participate in this study. There is no penalty for concluding this assignment. Do you wish to terminate?</p>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <Button onClick={confirm} style={{ marginRight: 16, width: 100 }} color='error' variant='contained'>Yes</Button>
                    <Button onClick={() => toggleQuitDialog(false)} style={{ width: 100 }} variant='contained'>No</Button>
                </div>
            </div>
        </Dialog>
    )
}