'use client'
import { Button } from "@mui/material";
import { useAuth } from "@/app/AuthProvider";
import { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, signOut } = useAuth()

    return (
        <>
            {user && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, paddingRight: 24 }}>
                    <Button onClick={signOut}>Sign out</Button>
                </div>
            )}
            {children}
        </>
    );
}

Layout.protected = true;