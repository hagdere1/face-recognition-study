import { useAuth } from "@/app/AuthProvider"
import { useNavigationContext } from "@/app/NavigationProvider"
import { Button } from "@mui/material"

type ResultsProps = {
    showNextButton: boolean
}

const NUM_RESPONSES = 9

export default function Results({ showNextButton }: ResultsProps) {
    const { user } = useAuth()

    const { proceed } = useNavigationContext()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
            <h2 style={{ marginBottom: 24, color: 'grey' }}>Results</h2>

            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8, color: 'blue' }}><strong>Trial 1</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, paddingBottom: 30, backgroundColor: '#eee', borderRadius: 8, width: 300 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ marginBottom: 4}}><strong>Accuracy</strong></div>
                            <div>{Math.round(user?.trial1.results.accuracy * 100)}%</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24}}>
                            <div style={{ marginBottom: 4}}><strong>Average Time</strong></div>
                            <div>{(user?.trial1.results.time / NUM_RESPONSES / 1000).toFixed(1)} seconds</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{ marginBottom: 4}}><strong>Total Time</strong></div>
                            <div>{(user?.trial1.results.time / 1000).toFixed(1)} seconds</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8, color: 'blue' }}><strong>Trial 2</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, paddingBottom: 30, backgroundColor: '#eee', borderRadius: 8, width: 300 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ marginBottom: 4}}><strong>Accuracy</strong></div>
                            <div>{Math.round(user?.trial2.results.accuracy * 100)}%</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24}}>
                            <div style={{ marginBottom: 4}}><strong>Average Time</strong></div>
                            <div>{(user?.trial2.results.time / NUM_RESPONSES / 1000).toFixed(1)} seconds</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{ marginBottom: 4}}><strong>Total Time</strong></div>
                            <div>{(user?.trial2.results.time / 1000).toFixed(1)} seconds</div>
                        </div>
                    </div>
                </div>
            </div>

            {showNextButton && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
                    <Button variant="contained" onClick={proceed} style={{ marginTop: 24 }}>Continue</Button>
                </div>
            )}
        </div>
    )
}