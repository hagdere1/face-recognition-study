'use client'
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import SelectInput, { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { useEffect, useState } from "react"
import { AuthManager } from "../page"
import { useAuth } from "../AuthProvider"

type Member = {
    email: string,
    group: string | null,
    role: string
}

export default function AdminView() {
    const { user } = useAuth()

    const [email, setEmail] = useState('')
    const [group, setGroup] = useState<string>('')
    const [role, setRole] = useState<string>('user')
    const [members, setMembers] = useState<Member[]>([])
    const [results, setResults] = useState()

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/users')
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
            const res = await fetch('http://localhost:3000/api/results')
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
        if (user?.role === 'admin') {
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
        setGroup('')
        setRole('user')
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

    if (user?.role !== 'admin') {
        return null
    }

    const resultCard = (title: string, time: number, accuracy: number) => (
        <div style={{ marginBottom: 24 }}>
            <div style={{ marginRight: 36 }}><strong>{title}</strong></div>

            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 24 }}>
                    <div>Accuracy:</div>
                    <div>Time:</div>
                </div>
                <div>
                    <div>{accuracy}</div>
                    <div>{time}</div>
                </div>
            </div>
        </div>
    )

    return (
        <AuthManager>
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: 36 }}>Admin Dashboard</h1>

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, width: '100%', padding: 36, marginBottom: 36 }}>
                    <div style={{ marginBottom: 36, width: '100%' }}>
                        <h3>Results</h3>
                        <div style={{ display: 'flex', marginTop: 24 }}>
                            <div style={{ padding: 24, borderRadius: 6, width: '50%', backgroundColor: '#fff', marginRight: 36 }}>
                                <div style={{ marginBottom: 24 }}><strong>Orphans</strong></div>

                                {/* @ts-ignore */}
                                {resultCard('Trial1', results?.orphan.trial1.time, results?.orphan.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial2', results?.orphan.trial2.time, results?.orphan.trial2.accuracy)}
                            </div>
                            <div style={{ padding: 24, borderRadius: 6, width: '50%', backgroundColor: '#fff' }}>
                                <div style={{ marginBottom: 24 }}><strong>Control</strong></div>
                                
                                {/* @ts-ignore */}
                                {resultCard('Trial1', results?.control.trial1.time, results?.control.trial1.accuracy)}

                                {/* @ts-ignore */}
                                {resultCard('Trial2', results?.control.trial2.time, results?.control.trial2.accuracy)}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#eee', borderRadius: 8, width: '100%', padding: 36, marginBottom: 36 }}>
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
                                    <MenuItem value={'user'}>Participant</MenuItem>
                                    <MenuItem value={'admin'}>Admin</MenuItem>
                                </Select>
                            </div>

                            {role === 'user' && (
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

                    <div style={{ marginRight: 36 }}>
                        <div style={{ marginBottom: 16 }}><strong>Admins</strong></div>
                        {members.filter(member => member.role === 'admin').map(member => <div key={member.email}>{member.role} - {member.email}</div>)}
                    </div>

                    <div>
                        <div style={{ marginBottom: 16 }}><strong>Participants</strong></div>
                        {members.filter(member => member.role === 'user').map(member => <div key={member.email}>{member.role} - {member.email} - {member.group}</div>)}
                    </div>
                </div>
            </div>
        </AuthManager>
    )
}