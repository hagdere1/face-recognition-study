import * as React from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useState } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'email', headerName: 'Email', width: 400 },
  { field: 'role', headerName: 'Role', width: 100 },
  { field: 'group', headerName: 'Group', width: 100 }
];

type DataTableProps = {
    users: any[]
}

export default function DataTable({ users }: DataTableProps) {
    const [selectedIds, setSelectedIds] = useState<GridRowId[]>([])

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: 16 }}>
                <Button disabled={!selectedIds.length} variant='contained' color='error' style={{ marginRight: 16 }}>Delete</Button>
            </div>

            <div style={{ height: 400, width: '100%', backgroundColor: 'white' }}>
                <DataGrid
                    rows={users.map(user => ({ ...user, id: user._id }))}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids: GridRowId[]) => {
                        setSelectedIds(ids);
                      }}
                />
            </div>
        </div>
    );
}