import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';
import { auth } from '../../../firebase-admin';
import { headers } from "next/headers"

connectDB()

export async function DELETE(req: Request, { params }: any) {
    const referer = headers().get("authorization");
  
    if (!referer) {
        return NextResponse.json({ error: 'Please include id token' }, { status: 401 });
    }

    try {
        const { uid } = await auth.verifyIdToken(referer.replace('Bearer ', ''));
        
        if (!uid) {
            throw Error('Unauthenticated')
        }

        const { id } = params

        const user = await UserDetail.findById(id)

        if (user.firebaseUid) {
            await auth.deleteUser(user.firebaseUid)
        }
        await UserDetail.deleteOne({ _id: id })

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}