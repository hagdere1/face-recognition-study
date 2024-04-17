import * as React from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog } from '@mui/material';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { BASE_URL } from '@/app/constants/urls';

type DeleteModalProps = {
    close: () => void,
    userId: any,
    refetch: () => void
}

function DeleteModal({ close, userId, refetch }: DeleteModalProps) {
    const confirm = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
                }
            })
            
            if (res.ok) {
                refetch()
                close()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Dialog open>
            <div style={{ padding: 36 }}>
                <div>Are you sure you want to delete this user?</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
                    <Button variant='contained' color='error' style={{ width: 100, marginRight: 16 }} onClick={confirm}>Yes</Button>
                    <Button variant='contained' style={{ width: 100 }} onClick={close}>No</Button>
                </div>
            </div>
        </Dialog>
    )
}

type DataTableProps = {
    users: any[],
    refetch: () => void
}

export default function DataTable({ users, refetch }: DataTableProps) {
    const [selectedUser, setSelectedUser] = useState<any>(null)

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'email', headerName: 'Email', width: 400 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'group', headerName: 'Group', width: 100 },
        { field: 'surveyPostTrial', headerName: 'Finished', width: 100, renderCell: (params) => params.row.surveyPostTrial ? 'yes' : 'no' },
        { field: 'delete', sortable: false, filterable: false, headerName: '', renderCell: (params) => <Button variant='contained' color='error' onClick={() => setSelectedUser(params.id)}>Delete</Button> }
    ];

    return (
        <>
            <div style={{ width: '100%' }}>
                <div>
                    <DataGrid
                        rows={users.map(user => ({ ...user, id: user._id }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                        style={{ maxHeight: 500, minHeight: 440, width: '100%', backgroundColor: 'white' }}
                    />
                </div>
            </div>

            {selectedUser && <DeleteModal userId={selectedUser} close={() => setSelectedUser(null)} refetch={refetch} />}
        </>
    );
}