import { useNavigationContext } from "@/app/NavigationProvider";
import { Button } from "@mui/material";

export default function ConsentButtons() {
    const { proceed, toggleQuitDialog } = useNavigationContext()

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 36 }}>
            <Button variant='contained' style={{ width: 100, marginRight: 16 }} onClick={proceed}>Yes</Button>
            <Button variant='contained' color='error' style={{ width: 100 }} onClick={() => toggleQuitDialog(true)}>No</Button>
        </div>
    )
}