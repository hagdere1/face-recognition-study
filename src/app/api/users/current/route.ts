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

        const queryString = req.url.split('?')[1]
        const params = queryString.split('&')
        const email = params[0].split('=')[1]
        const firebaseUid = params[1].split('=')[1]

        const currentUser = await UserDetail.findOneAndUpdate({ email: new RegExp(`^${email}$`, 'i') }, { firebaseUid }, { new: true }).exec()

        return NextResponse.json(currentUser, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}