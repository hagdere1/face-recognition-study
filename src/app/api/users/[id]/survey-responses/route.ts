import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';
import { auth } from '../../../../firebase-admin';
import { headers } from "next/headers"

connectDB()

export async function PUT(req: Request, { params }: any) {
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

        const body = await req.json()
        const key = body.surveyPreTrial ? 'surveyPreTrial' : 'surveyPostTrial'
        const user = await UserDetail.findOneAndUpdate({ _id: id }, { [key]: body[key] }, { new: true })
        
        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}