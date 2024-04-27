import { NUM_RESPONSES } from "@/app/constants/responses"
import { DataGrid, GridColumnHeaderParams } from "@mui/x-data-grid"

type SurveyPreTrialResultsProps = {
    results: any[],
    role: string
}

export default function SurveyPreTrialResults({ results, role }: SurveyPreTrialResultsProps) {
    return (
        <div style={{ width: '100%' }}>
            <h3>[{role.toUpperCase()}] Results: Pre-Trial Survey</h3>
            <div style={{ marginTop: 24 }}>
                {results?.surveyPreTrial.map((question: any) => {
                    const renderHeader = (params: GridColumnHeaderParams) => <strong>{params.colDef.headerName}</strong>
                    const columns = [
                        { field: 'option', headerName: question.question, width: 300, renderHeader },

                        { field: 'control_t1_accuracy', headerName: 'C T1 Accuracy', width: 150, renderHeader },
                        { field: 'control_t1_time', headerName: 'C T1 Time (s)', width: 150, renderHeader },
                        { field: 'control_t1_avgtime', headerName: 'C T1 Avg Time (s)', width: 150, renderHeader },

                        { field: 'control_t2_accuracy', headerName: 'C T2 Accuracy', width: 150, renderHeader },
                        { field: 'control_t2_time', headerName: 'C T2 Time (s)', width: 150, renderHeader },
                        { field: 'control_t2_avgtime', headerName: 'C T2 Avg Time (s)', width: 150, renderHeader },

                        { field: 'orphan_t1_accuracy', headerName: 'E T1 Accuracy', width: 150, renderHeader },
                        { field: 'orphan_t1_time', headerName: 'E T1 Time (s)', width: 150, renderHeader },
                        { field: 'orphan_t1_avgtime', headerName: 'E T1 Avg Time (s)', width: 150, renderHeader },

                        { field: 'orphan_t2_accuracy', headerName: 'E T2 Accuracy', width: 150, renderHeader },
                        { field: 'orphan_t2_time', headerName: 'E T2 Time (s)', width: 150, renderHeader },
                        { field: 'orphan_t2_avgtime', headerName: 'E T2 Avg Time (s)', width: 150, renderHeader }
                    ]

                    return (
                        <DataGrid
                            key={question}
                            density="compact"
                            disableRowSelectionOnClick
                            disableColumnFilter
                            disableColumnMenu
                            disableColumnSorting
                            disableDensitySelector
                            hideFooter
                            rows={question.results.map(result => ({ 
                                id: crypto.randomUUID(),
                                option: result.option,

                                control_t1_accuracy: result[role].control.count > 0 ? Math.round(result[role].control.trial1.accuracy * 100) + '%' : '-',
                                control_t1_time: result[role].control.count > 0 ? (result[role].control.trial1.time / 1000).toFixed(1) : '-',
                                control_t1_avgtime: result[role].control.count > 0 ? ((result[role].control.trial1.time / NUM_RESPONSES) / 1000).toFixed(1) : '-',

                                control_t2_accuracy: result[role].control.count > 0 ? Math.round(result[role].control.trial2.accuracy * 100) + '%' : '-',
                                control_t2_time: result[role].control.count > 0 ? (result[role].control.trial2.time / 1000).toFixed(1) : '-',
                                control_t2_avgtime: result[role].control.count > 0 ? ((result[role].control.trial2.time / NUM_RESPONSES) / 1000).toFixed(1) : '-',

                                orphan_t1_accuracy: result[role].orphan.count > 0 ? Math.round(result[role].orphan.trial1.accuracy * 100) + '%' : '-',
                                orphan_t1_time: result[role].orphan.count > 0 ? (result[role].orphan.trial1.time / 1000).toFixed(1) : '-',
                                orphan_t1_avgtime: result[role].orphan.count > 0 ? ((result[role].orphan.trial1.time / NUM_RESPONSES) / 1000).toFixed(1) : '-',

                                orphan_t2_accuracy: result[role].orphan.count > 0 ? Math.round(result[role].orphan.trial2.accuracy * 100) + '%' : '-',
                                orphan_t2_time: result[role].orphan.count > 0 ? (result[role].orphan.trial2.time / 1000).toFixed(1) : '-',
                                orphan_t2_avgtime: result[role].orphan.count > 0 ? ((result[role].orphan.trial2.time / NUM_RESPONSES) / 1000).toFixed(1) : '-',
                            }))}
                            columns={columns}
                            style={{ width: '100%', backgroundColor: 'white', marginTop: 24 }}
                        />
                    )
                })}
            </div>
        </div>
    )
}