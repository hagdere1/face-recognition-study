'use client'
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { useEffect, useState } from "react"
import { AuthManager } from "../page"
import { useAuth } from "../AuthProvider"
import { GROUP, ROLE } from "../constants/roles"
import { NUM_RESPONSES } from "../constants/responses"
import Cookies from 'js-cookie'

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

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/users', {
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
            const res = await fetch('http://localhost:3000/api/results', {
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

    useEffect(() => {
        if (user?.role === ROLE.ADMIN) {
            fetchUsers()
            fetchResults()
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
            const res = await fetch('http://localhost:3000/api/users', { 
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
                    <div style={{ marginBottom: 4 }}>Accuracy:</div>
                    <div style={{ marginBottom: 4 }}>Total Time:</div>
                    <div style={{ marginBottom: 4 }}>Avg. Time:</div>
                </div>
                <div>
                    <div style={{ marginBottom: 4 }}>{Math.round(accuracy * 100)}%</div>
                    <div style={{ marginBottom: 4 }}>{(time / 1000).toFixed(1)}s</div>
                    <div style={{ marginBottom: 4 }}>{((time / NUM_RESPONSES) / 1000).toFixed(1)}s</div>
                </div>
            </div>
        </div>
    )

    const admins = members.filter(member => member.role === ROLE.ADMIN)
    const users = members.filter(member => member.role === ROLE.USER)

    const testers = members.filter(member => member.role === ROLE.TESTER)
    const testersOrphan = testers.filter(member => member.group === GROUP.ORPHAN)
    const testersControl = testers.filter(member => member.group === GROUP.CONTROL)

    const orphans = users.filter(member => member.group === GROUP.ORPHAN)
    const control = users.filter(member => member.group === GROUP.CONTROL)

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
                        <div style={{ marginRight: 36, width: '33.3%' }}>
                            <div style={{ marginBottom: 36 }}>
                                <div style={{ marginBottom: 16 }}><strong>Admins</strong> ({admins.length})</div>
                                <ul style={{ padding: 24, borderRadius: 6, backgroundColor: '#fff' }}>
                                    {admins.map(member => <li key={member.email} style={{ wordBreak: 'break-word', marginBottom: 6 }}>{member.email}</li>)}
                                </ul>
                            </div>
                            <div style={{ marginBottom: 36 }}>
                                <div style={{ marginBottom: 16 }}><strong>Testers: Orphan</strong> ({testersOrphan.length})</div>
                                <ul style={{ padding: 24, borderRadius: 6, backgroundColor: '#fff' }}>
                                    {testersOrphan.map(member => <li key={member.email} style={{ wordBreak: 'break-word', marginBottom: 6 }}>{member.email}</li>)}
                                </ul>
                            </div>
                            <div>
                                <div style={{ marginBottom: 16 }}><strong>Testers: Control</strong> ({testersControl.length})</div>
                                <ul style={{ padding: 24, borderRadius: 6, backgroundColor: '#fff' }}>
                                    {testersControl.map(member => <li key={member.email} style={{ wordBreak: 'break-word', marginBottom: 6 }}>{member.email}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div style={{ marginRight: 36, width: '33.3%' }}>
                            <div style={{ marginBottom: 16 }}><strong>Participants: Orphan</strong> ({orphans.length})</div>
                            <ul style={{ padding: 24, borderRadius: 6, backgroundColor: '#fff' }}>
                                {orphans.map(member => <li key={member.email} style={{ wordBreak: 'break-word', marginBottom: 6 }}>{member.email}</li>)}
                            </ul>
                        </div>

                        <div style={{ width: '33.3%' }}>
                            <div style={{ marginBottom: 16 }}><strong>Participants: Control</strong> ({control.length})</div>
                            <ul style={{ padding: 24, borderRadius: 6, backgroundColor: '#fff' }}>
                                {control.map(member => <li key={member.email} style={{ wordBreak: 'break-word', marginBottom: 6 }}>{member.email}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, border: '1px solid #ccc', width: '100%', padding: 36 }}>
                    <div style={{ marginBottom: 36, width: '100%' }}>
                        <h3>Results</h3>
                        <div style={{ display: 'flex', marginTop: 24 }}>
                            <div style={{ padding: 24, borderRadius: 6, width: '50%', backgroundColor: '#fff', marginRight: 36 }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Orphans</strong> ({results?.orphan.count})</div>

                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.orphan.trial1.time, results?.orphan.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.orphan.trial2.time, results?.orphan.trial2.accuracy)}
                            </div>
                            <div style={{ padding: 24, borderRadius: 6, width: '50%', backgroundColor: '#fff' }}>
                                {/* @ts-ignore */}
                                <div style={{ marginBottom: 24 }}><strong>Control</strong> ({results?.control.count})</div>
                                
                                {/* @ts-ignore */}
                                {resultCard('Trial 1', results?.control.trial1.time, results?.control.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial 2', results?.control.trial2.time, results?.control.trial2.accuracy)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthManager>
    )
}