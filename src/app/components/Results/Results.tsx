type Response = {
    time: number,
    correctAnswer: number,
    selectedAnswer: number
  }

type ResultsProps = {
    trial1Responses: Response[],
    trial2Responses: Response[]
}

export default function Results({ trial1Responses, trial2Responses }: ResultsProps) {
    const calculateResults = () => {
        const allResponses = trial1Responses.concat(trial2Responses)
        let totalTime = 0
        let numberCorrect = 0

        for (let i = 0; i < allResponses.length; i++) {
            totalTime += allResponses[i].time

            if (allResponses[i].selectedAnswer === allResponses[i].correctAnswer) {
                numberCorrect += 1
            }
        }

        return {
            accuracy: numberCorrect / allResponses.length,
            averageTime: Math.round(totalTime / allResponses.length),
            totalTime
        }
    }

    const results = calculateResults()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
            <h2 style={{ marginBottom: 24, color: 'grey' }}>Results</h2>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, paddingBottom: 30, backgroundColor: '#eee', borderRadius: 8, width: 300 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ marginBottom: 4}}><strong>Accuracy</strong></div>
                    <div>{Math.round(results.accuracy * 100)}%</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24}}>
                    <div style={{ marginBottom: 4}}><strong>Average Time</strong></div>
                    <div>{(results.averageTime / 1000).toFixed(1)} seconds</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{ marginBottom: 4}}><strong>Total Time</strong></div>
                    <div>{(results.totalTime / 1000).toFixed(1)} seconds</div>
                </div>
            </div>
        </div>
    )
}