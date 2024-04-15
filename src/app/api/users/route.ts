import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { auth } from '../../firebase-admin';
import { headers } from "next/headers"

connectDB()

export async function GET(req: Request) {
    const referer = headers().get("authorization");
  
    if (!referer) {
        return NextResponse.json({ error: 'Please include id token' }, { status: 401 });
    }

    try {
        const { uid } = await auth.verifyIdToken(referer.replace('Bearer ', ''));
        
        if (!uid) {
            throw Error('Unauthenticated')
        }

        const users = await UserDetail.find().exec()
        return NextResponse.json(users, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}

export async function POST(req: Request) {
    const { email, role, group } = await req.json()
    const referer = headers().get("authorization");
  
    if (!referer) {
        return NextResponse.json({ error: 'Please include id token' }, { status: 401 });
    }

    try {
        const { uid } = await auth.verifyIdToken(referer.replace('Bearer ', ''));
        
        if (!uid) {
            throw Error('Unauthenticated')
        }

        const user = await UserDetail.create({ email, role, group })
        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.log(error)
    }
}