import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';

connectDB()

export async function PUT(req: Request, params: any) {
    const { id } = params
    const body = await req.json()
    const key = body.surveyPreTrial ? 'surveyPreTrial' : 'surveyPostTrial'
    const user = await UserDetail.findOneAndUpdate(id, { [key]: body[key] }, { new: true })
    return NextResponse.json(user, { status: 200 })
}