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
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px 0 24px' }}>
                    {user.role === ROLE.ADMIN && (
                        <div>
                            <Button onClick={() => router.push('/admin')} style={{ marginRight: 8 }}>ADMIN DASHBOARD</Button>
                            <Button onClick={() => router.push('/')}>TRIAL</Button>
                        </div>
                    )}
                    <Button onClick={signOut}>Sign out</Button>
                </div>
            )}
            {children}
        </>
    );
}

Layout.protected = true;