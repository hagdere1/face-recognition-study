import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';

connectDB()

export async function PUT(req: Request, { params }: any) {
    const { id } = params
    const user = await UserDetail.findOneAndUpdate({ _id: id }, { quit: true }, { new: true })
    return NextResponse.json(user, { status: 200 })
}