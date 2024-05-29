import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

connectDB()

export async function PUT(req: Request, { params }: any) {
    try {
        const token = cookies().get("token")?.value || "";
        const data = jwt.verify(token, process.env.TOKEN_SECRET || '');

        if (!data) {
            return NextResponse.json({ error: 'Please include id token' }, { status: 401 })
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