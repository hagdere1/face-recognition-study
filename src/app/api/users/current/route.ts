import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';
import { auth } from '../../../firebase-admin';
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

        const email = req.url.split('?')[1].split('=')[1]
        const currentUser = await UserDetail.findOne({ email }).exec()

        return NextResponse.json(currentUser, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}