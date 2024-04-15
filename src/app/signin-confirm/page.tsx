'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

export default function SignInConfirm() {
    const router = useRouter();

    const { verifyEmailLinkAndLogin } = useAuth()

    const handleVerify = async () => {
        const isSuccess = await verifyEmailLinkAndLogin();
        
        if (!isSuccess) {
            return router.replace("/signin");
        }
        return router.replace("/");
    };

    useEffect(() => {
        handleVerify();
    }, []);

    return (
        null
    )
}