import { NUM_RESPONSES } from "@/app/constants/responses"
import { DataGrid, GridColumnHeaderParams } from "@mui/x-data-grid"

type IndividualResultsProps = {
    users: any[] | undefined,
    role: string
}

export default function IndividualResults({ users, role }: IndividualResultsProps) {
    const renderHeader = (params: GridColumnHeaderParams) => <strong>{params.colDef.headerName}</strong>
    const columns = [
        { field: 'id', headerName: 'User', width: 180, renderHeader },
        { field: 'group', headerName: 'Group', width: 100, renderHeader },

        { field: 'trial1Accuracy', headerName: 'T1: Accuracy', width: 150, renderHeader },
        { field: 'trial1Time', headerName: 'T1: Time (s)', width: 150, renderHeader },
        { field: 'trial1AvgTime', headerName: 'T1: Avg Time (s)', width: 150, renderHeader },

        { field: 'trial2Accuracy', headerName: 'T2: Accuracy', width: 150, renderHeader },
        { field: 'trial2Time', headerName: 'T2: Time (s)', width: 150, renderHeader },
        { field: 'trial2AvgTime', headerName: 'T2: Avg Time (s)', width: 150, renderHeader }
    ]

    return (
        <div style={{ width: '100%' }}>
            <h3>[{role.toUpperCase()}] Results: Individual</h3>
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
                    rows={users.map((user: any) => ({ 
                        id: crypto.randomUUID(),
                        group: user.group,

                        trial1Accuracy: Math.round(user.trial1.results.accuracy * 100) + '%',
                        trial1Time: (user.trial1.results.time / 1000).toFixed(1),
                        trial1AvgTime: ((user.trial1.results.time / NUM_RESPONSES) / 1000).toFixed(1),

                        trial2Accuracy: Math.round(user.trial2.results.accuracy * 100) + '%',
                        trial2Time: (user.trial2.results.time / 1000).toFixed(1),
                        trial2AvgTime: ((user.trial2.results.time / NUM_RESPONSES) / 1000).toFixed(1)
                    }))}
                    // @ts-ignore
                    columns={columns}
                    style={{ width: '100%', backgroundColor: 'white', marginTop: 24 }}
                />
            </div>
        </div>
    )
}