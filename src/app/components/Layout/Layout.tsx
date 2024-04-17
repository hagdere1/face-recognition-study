'use client'
import { Button } from "@mui/material";
import { useAuth } from "@/app/AuthProvider";
import { ReactNode } from "react";
import { ROLE } from "@/app/constants/roles";
import { useRouter } from "next/navigation";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, signOut } = useAuth()

    const router = useRouter()

    return (
        <>
            {user && (
                <div style={{ display: 'flex', justifyContent: user.role === ROLE.ADMIN ? 'space-between' : 'flex-end', padding: '12px 24px 36px 24px', }}>
                    <div style={{ fontSize: 18 }}><strong>Face Recognition Study</strong></div>

                    <div>
                        {user.role === ROLE.ADMIN && (
                            <>
                                <Button onClick={() => router.push('/admin')} style={{ marginRight: 8 }}>ADMIN DASHBOARD</Button>
                                <Button onClick={() => router.push('/')} style={{ marginRight: 8 }}>TRIAL</Button>
                            </>
                        )}
                        <Button onClick={signOut}>Sign out</Button>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}

Layout.protected = true;