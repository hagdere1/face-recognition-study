'use client'
import { Box, Button, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { ROLE, GROUP } from "../constants/roles"
import { NUM_RESPONSES } from "../constants/responses"
import Cookies from 'js-cookie'
import UsersTable from "../components/UsersTable"
import { AuthManager } from "../AuthManager"
import { BASE_URL } from "../constants/urls"
import SurveyPreTrialResults from "../components/FullResults/SurveyPreTrialResults"
import TrialResults from "../components/FullResults/TrialResults"
import IndividualResults from "../components/FullResults/IndividualResults"
import SurveyPostTrialResults from "../components/FullResults/SurveyPostTrialResults"
import { DataGrid, GridColumnHeaderParams, GridToolbar } from "@mui/x-data-grid"

type Member = {
    email: string,
    group: string | null,
    role: string,
    surveyPostTrial: any
}

export default function AdminView() {
    const { status, user } = useAuth()

    const [tab, setTab] = useState(0)

    const [email, setEmail] = useState('')
    const [group, setGroup] = useState<string>('')
    const [role, setRole] = useState<string>('user')

    const [members, setMembers] = useState<Member[]>([])
    const [results, setResults] = useState()
    const [fullResults, setFullResults] = useState<any[]>()

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/users`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`
                }
            })
            if (!res.ok) {
                throw new Error('Failed to fetch')
            }
            const data = await res.json()

            setMembers(data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchResults = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/results`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`
                }
            })
            if (!res.ok) {
                throw new Error('Failed to fetch')
            }
            const data = await res.json()

            setResults(data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchFullResults = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/full-results`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`
                }
            })
            if (!res.ok) {
                throw new Error('Failed to fetch')
            }
            const data = await res.json()

            setFullResults(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (user?.role === ROLE.ADMIN) {
            fetchUsers()
            fetchResults()
            fetchFullResults()
        }
    }, [user?.role])

    const createAccount = async (e: any) => {
        e.preventDefault()

        const member = {
            email: email.trim().toLowerCase(),
            group: group ? group : null,
            role
        }

        try {
            const res = await fetch(`${BASE_URL}api/users`, { 
                method: 'POST', 
                headers: {
                    Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(member)
            })
            if (res.ok) {
                const newMember = await res.json()
                setMembers([...members, newMember])
            }
        } catch (err) {
            console.log(err)
        }

        setEmail('')
    }

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const handleGroupChange = (event: SelectChangeEvent) => {
        setGroup(event.target.value as string);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const isSubmitDisabled = () => {
        if (role === 'user') {
            return !(group && email)
        } else {
            return !email
        }
    }

    if (status === "authenticated" && user?.role !== ROLE.ADMIN) {
        return (
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                Access denied
            </div>
        )
    }

    if (!results || !fullResults) {
        return null
    }

    return (
        <AuthManager>
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: 36 }}>Admin Dashboard</h1>

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Create Account" {...a11yProps(0)} />
                            <Tab label="Results: Test" {...a11yProps(1)} />
                            <Tab label="Results: Actual" {...a11yProps(2)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={tab} index={0}>
                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <div>
                                <div style={{ padding: 24, borderRadius: 6, width: 300, backgroundColor: '#fff', marginRight: 36 }}>
                                    <h3>Add a user</h3>

                                    <div style={{ marginBottom: 24, marginTop: 24 }}>
                                        <InputLabel id="role-select-label">Role</InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            id="role-select"
                                            value={role}
                                            label="Role"
                                            onChange={handleRoleChange}
                                            fullWidth
                                        >
                                            <MenuItem value={ROLE.USER}>Participant</MenuItem>
                                            <MenuItem value={ROLE.TESTER}>Tester</MenuItem>
                                            <MenuItem value={ROLE.ADMIN}>Admin</MenuItem>
                                        </Select>
                                    </div>

                                    {role !== ROLE.ADMIN && (
                                        <div style={{ marginBottom: 24, marginTop: 24 }}>
                                            <InputLabel id="group-select-label">Group</InputLabel>
                                            <Select
                                                labelId="group-select-label"
                                                id="group-select"
                                                value={group}
                                                label="Group"
                                                onChange={handleGroupChange}
                                                fullWidth
                                            >
                                                <MenuItem value={'control'}>Control</MenuItem>
                                                <MenuItem value={'orphan'}>Orphan</MenuItem>
                                            </Select>
                                        </div>
                                    )}
                                    
                                    <div style={{ marginBottom: 24 }}>
                                        <InputLabel id="email-input-label">Email Address</InputLabel>
                                        <TextField 
                                            type='email'
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            fullWidth
                                        />
                                    </div>

                                    <Button fullWidth variant='contained' onClick={createAccount} disabled={isSubmitDisabled()}>Add</Button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flex: 1 }}>
                                <UsersTable users={members} refetch={() => {
                                    fetchUsers()
                                    fetchResults()
                                }} />
                            </div>
                        </div>
                    </CustomTabPanel>

                    <CustomTabPanel value={tab} index={1}>
                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <div style={{ width: '100%' }}>
                                <h3>[TESTER] Results: Overview</h3>
                                <div style={{ display: 'flex' }}>
                                    <ResultsOverview role={ROLE.TESTER} results={results} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <SurveyPreTrialResults results={fullResults} role={ROLE.TESTER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <TrialResults results={fullResults} role={ROLE.TESTER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <IndividualResults users={members.filter(member => member.surveyPostTrial && member.role === ROLE.TESTER)} role={ROLE.TESTER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <SurveyPostTrialResults results={fullResults} role={ROLE.TESTER} />
                        </div>
                    </CustomTabPanel>

                    <CustomTabPanel value={tab} index={2}>
                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <div style={{ width: '100%' }}>
                                <h3>[USER] Results: Overview</h3>
                                <div style={{ display: 'flex' }}>
                                    <ResultsOverview role={ROLE.USER} results={results} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <SurveyPreTrialResults results={fullResults} role={ROLE.USER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <TrialResults results={fullResults} role={ROLE.USER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <IndividualResults users={members.filter(member => member.surveyPostTrial && member.role === ROLE.USER)} role={ROLE.USER} />
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                            <SurveyPostTrialResults results={fullResults} role={ROLE.USER} />
                        </div>                       
                    </CustomTabPanel>
                </Box>
            </div>
        </AuthManager>
    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}  

function ResultsOverview({ role, results }: { role: string, results: any }) {
    const rows = [
        {
            id: crypto.randomUUID(),
            group: 'Control',
            
            t1_accuracy: Math.round(results[role].control.trial1.accuracy * 100) + '%',
            t1_time: (results[role].control.trial1.time / 1000).toFixed(1) + 's',
            t1_avgtime: ((results[role].control.trial1.time / NUM_RESPONSES) / 1000).toFixed(1) + 's',

            t2_accuracy: Math.round(results[role].control.trial2.accuracy * 100) + '%',
            t2_time: (results[role].control.trial2.time / 1000).toFixed(1) + 's',
            t2_avgtime: ((results[role].control.trial2.time / NUM_RESPONSES) / 1000).toFixed(1) + 's'
        },
        {
            id: crypto.randomUUID(),
            group: 'Experimental',
            
            t1_accuracy: Math.round(results[role].orphan.trial1.accuracy * 100) + '%',
            t1_time: (results[role].orphan.trial1.time / 1000).toFixed(1) + 's',
            t1_avgtime: ((results[role].orphan.trial1.time / NUM_RESPONSES) / 1000).toFixed(1) + 's',

            t2_accuracy: Math.round(results[role].orphan.trial2.accuracy * 100) + '%',
            t2_time: (results[role].orphan.trial2.time / 1000).toFixed(1) + 's',
            t2_avgtime: ((results[role].orphan.trial2.time / NUM_RESPONSES) / 1000).toFixed(1) + 's'
        }
    ]

    const renderHeader = (params: GridColumnHeaderParams) => <strong>{params.colDef.headerName}</strong>
    const columns = [
        { field: 'group', headerName: 'Group', width: 150, renderHeader },

        { field: 't1_accuracy', headerName: 'T1 Accuracy', width: 150, renderHeader },
        { field: 't1_time', headerName: 'T1 Time (s)', width: 150, renderHeader },
        { field: 't1_avgtime', headerName: 'T1 Avg Time (s)', width: 150, renderHeader },

        { field: 't2_accuracy', headerName: 'T2 Accuracy', width: 150, renderHeader },
        { field: 't2_time', headerName: 'T2 Time (s)', width: 150, renderHeader },
        { field: 't2_avgtime', headerName: 'T2 Avg Time (s)', width: 150, renderHeader },
    ]

    return (
        <div>
            <DataGrid
                slots={{ toolbar: GridToolbar }}
                density="compact"
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                disableColumnSorting
                disableDensitySelector
                hideFooter
                rows={rows}
                // @ts-ignore
                columns={columns}
                style={{ width: '100%', backgroundColor: 'white', marginTop: 24, maxHeight: 148 }}
            />
        </div>
    )
}