'use client'
import { Button } from "@mui/material";
import { useAuth } from "@/app/AuthProvider";
import { ReactNode } from "react";

type AuthenticatedLayoutProps = {
    children: ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const { signOut } = useAuth()

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, paddingRight: 24 }}>
                <Button onClick={signOut}>Sign out</Button>
            </div>
            {children}
        </>
    );
}

AuthenticatedLayout.protected = true;