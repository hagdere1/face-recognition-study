import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';

connectDB()

export async function GET(req: Request) {
    const users = await UserDetail.find().exec()
    return NextResponse.json(users, { status: 200 })
}

export async function POST(req: Request) {
    const { email, role, group } = await req.json()
    const user = await UserDetail.create({ email, role, group })
    return NextResponse.json(user, { status: 201 })
}