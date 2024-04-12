import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';

connectDB()

export async function GET(req: Request) {
    const email = req.url.split('?')[1].split('=')[1]
    const currentUser = await UserDetail.findOne({ email }).exec()
    return NextResponse.json(currentUser, { status: 200 })
}