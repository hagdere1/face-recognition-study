import { DataGrid, GridColumnHeaderParams } from "@mui/x-data-grid"

type ResultsProps = {
    results: any[] | undefined,
    role: string
}

export default function TrialResults({ results, role }: ResultsProps) {
    const renderHeader = (params: GridColumnHeaderParams) => <strong>{params.colDef.headerName}</strong>
    const columns = [
        { field: 'attributeName', headerName: 'Attribute', width: 220, renderHeader },

        { field: 'control_t1_accuracy', headerName: 'C T1 Accuracy', width: 150, renderHeader },
        { field: 'control_t1_avgtime', headerName: 'C T1 Avg Time (s)', width: 150, renderHeader },

        { field: 'control_t2_accuracy', headerName: 'C T2 Accuracy', width: 150, renderHeader },
        { field: 'control_t2_avgtime', headerName: 'C T2 Avg Time (s)', width: 150, renderHeader },

        { field: 'orphan_t1_accuracy', headerName: 'E T1 Accuracy', width: 150, renderHeader },
        { field: 'orphan_t1_avgtime', headerName: 'E T1 Avg Time (s)', width: 150, renderHeader },

        { field: 'orphan_t2_accuracy', headerName: 'E T2 Accuracy', width: 150, renderHeader },
        { field: 'orphan_t2_avgtime', headerName: 'E T2 Avg Time (s)', width: 150, renderHeader }
    ]

    return (
        <div style={{ width: '100%' }}>
            <h3>[{role.toUpperCase()}] Results: Face Attributes</h3>
            <div style={{ marginTop: 24 }}>
                <DataGrid
                    density="compact"
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSorting
                    disableDensitySelector
                    hideFooter
                    // @ts-ignore
                    rows={results?.trials.map((result: any) => ({ 
                        id: crypto.randomUUID(),
                        attributeName: result.attributeName,

                        control_t1_accuracy: result[role].control.trial1.count > 0 ? Math.round(result[role].control.trial1.accuracy * 100) + '%' : '-',
                        control_t1_avgtime: result[role].control.trial1.count > 0 ? (result[role].control.trial1.time / 1000).toFixed(1) : '-',

                        control_t2_accuracy: result[role].control.trial2.count > 0 ? Math.round(result[role].control.trial2.accuracy * 100) + '%' : '-',
                        control_t2_avgtime: result[role].control.trial2.count > 0 ? (result[role].control.trial2.time / 1000).toFixed(1) : '-',

                        orphan_t1_accuracy: result[role].orphan.trial1.count > 0 ? Math.round(result[role].orphan.trial1.accuracy * 100) + '%' : '-',
                        orphan_t1_avgtime: result[role].orphan.trial1.count > 0 ? (result[role].orphan.trial1.time / 1000).toFixed(1) : '-',

                        orphan_t2_accuracy: result[role].orphan.trial2.count > 0 ? Math.round(result[role].orphan.trial2.accuracy * 100) + '%' : '-',
                        orphan_t2_avgtime: result[role].orphan.trial2.count > 0 ? (result[role].orphan.trial2.time / 1000).toFixed(1) : '-',
                    }))}
                    columns={columns}
                    style={{ width: '100%', backgroundColor: 'white', marginTop: 24 }}
                />
            </div>
        </div>
    )
}