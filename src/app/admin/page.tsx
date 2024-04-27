'use client'
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { GROUP, ROLE } from "../constants/roles"
import { NUM_RESPONSES } from "../constants/responses"
import Cookies from 'js-cookie'
import UsersTable from "../components/UsersTable"
import { AuthManager } from "../AuthManager"
import { BASE_URL } from "../constants/urls"
import { DataGrid, GridColumnHeaderParams } from "@mui/x-data-grid"
import { randomUUID } from "crypto"
import SurveyPreTrialResults from "../components/FullResults/SurveyPreTrialResults/SurveyPreTrialResults"

type Member = {
    email: string,
    group: string | null,
    role: string
}

export default function AdminView() {
    const { status, user } = useAuth()

    const [email, setEmail] = useState('')
    const [group, setGroup] = useState<string>('')
    const [role, setRole] = useState<string>('user')
    const [members, setMembers] = useState<Member[]>([])
    const [results, setResults] = useState()
    const [fullResults, setFullResults] = useState()

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
            email,
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

    const resultCard = (title: string, time: number, accuracy: number) => (
        <div style={{ marginBottom: 24 }}>
            <div style={{ marginRight: 36, marginBottom: 12 }}><strong>{title}</strong></div>

            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 24 }}>
                    <div style={{ marginBottom: 4, color: '#666' }}>Accuracy:</div>
                    <div style={{ marginBottom: 4, color: '#666' }}>Total Time:</div>
                    <div style={{ marginBottom: 4, color: '#666' }}>Avg. Time:</div>
                </div>
                <div>
                    <div style={{ marginBottom: 4 }}>{Math.round(accuracy * 100)}%</div>
                    <div style={{ marginBottom: 4 }}>{(time / 1000).toFixed(1)}s</div>
                    <div style={{ marginBottom: 4 }}>{((time / NUM_RESPONSES) / 1000).toFixed(1)}s</div>
                </div>
            </div>
        </div>
    )

    return (
        <AuthManager>
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: 36 }}>Admin Dashboard</h1>

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

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                    <div style={{ marginBottom: 36, width: '100%' }}>
                        <h3>Results: Overview</h3>
                        <div style={{ display: 'flex', marginTop: 24 }}>
                            <div style={{ padding: 24, borderRadius: 6, width: '25%', backgroundColor: '#fff', marginRight: 36 }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Orphans</strong> ({results?.user.orphan.count})</div>

                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.user.orphan.trial1.time, results?.user.orphan.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.user.orphan.trial2.time, results?.user.orphan.trial2.accuracy)}
                            </div>
                            <div style={{ padding: 24, borderRadius: 6, width: '25%', backgroundColor: '#fff', marginRight: 36 }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Control</strong> ({results?.user.control.count})</div>
                                
                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.user.control.trial1.time, results?.user.control.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.user.control.trial2.time, results?.user.control.trial2.accuracy)}
                            </div>
                            {/* TESTER RESULTS */}
                            <div style={{ padding: 24, borderRadius: 6, width: '25%', backgroundColor: '#fff', marginRight: 36 }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Test: Orphans</strong> ({results?.tester.orphan.count})</div>

                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.tester.orphan.trial1.time, results?.tester.orphan.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.tester.orphan.trial2.time, results?.tester.orphan.trial2.accuracy)}
                            </div>
                            <div style={{ padding: 24, borderRadius: 6, width: '25%', backgroundColor: '#fff' }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Test: Control</strong> ({results?.tester.control.count})</div>
                                
                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.tester.control.trial1.time, results?.tester.control.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.tester.control.trial2.time, results?.tester.control.trial2.accuracy)}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                    <SurveyPreTrialResults results={fullResults} role={ROLE.TESTER} />
                </div>

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36, marginBottom: 36 }}>
                    <SurveyPreTrialResults results={fullResults} role={ROLE.USER} />
                </div>
            </div>
        </AuthManager>
    )
}