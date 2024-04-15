import { useNavigationContext } from "@/app/NavigationProvider"
import { NUM_RESPONSES } from "@/app/constants/responses"
import { Button } from "@mui/material"

type ResultsProps = {
    trial1Results: any,
    trial2Results: any
}

export default function Results({ trial1Results, trial2Results }: ResultsProps) {
    const { proceed } = useNavigationContext()

    if (!trial1Results || !trial2Results) {
        return null
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
            <h2 style={{ marginBottom: 24, color: 'grey' }}>Results</h2>

            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8, color: 'blue' }}><strong>Trial 1</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, paddingBottom: 30, backgroundColor: '#eee', borderRadius: 8, width: 300 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ marginBottom: 4}}><strong>Accuracy</strong></div>
                            <div>{Math.round(trial1Results.accuracy * 100)}%</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24}}>
                            <div style={{ marginBottom: 4}}><strong>Average Time</strong></div>
                            <div>{(trial1Results.time / NUM_RESPONSES / 1000).toFixed(1)} seconds</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{ marginBottom: 4}}><strong>Total Time</strong></div>
                            <div>{(trial1Results.time / 1000).toFixed(1)} seconds</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginRight: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 8, color: 'blue' }}><strong>Trial 2</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, paddingBottom: 30, backgroundColor: '#eee', borderRadius: 8, width: 300 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ marginBottom: 4}}><strong>Accuracy</strong></div>
                            <div>{Math.round(trial2Results.accuracy * 100)}%</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24}}>
                            <div style={{ marginBottom: 4}}><strong>Average Time</strong></div>
                            <div>{(trial2Results.time / NUM_RESPONSES / 1000).toFixed(1)} seconds</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{ marginBottom: 4}}><strong>Total Time</strong></div>
                            <div>{(trial2Results.time / 1000).toFixed(1)} seconds</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
                <Button variant="contained" onClick={proceed} style={{ marginTop: 24 }}>Continue</Button>
            </div>
        </div>
    )
}