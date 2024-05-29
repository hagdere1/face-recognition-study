import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

connectDB()

export async function GET(req: Request) {
    try {
        const token = cookies().get("token")?.value || "";
        const data = jwt.verify(token, process.env.TOKEN_SECRET || '');

        if (!data) {
            return NextResponse.json({ error: 'Please include id token' }, { status: 401 })
        }

        const users = await UserDetail.find().exec()
        return NextResponse.json(users, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}

export async function POST(req: Request) {
    const { email, role, group } = await req.json()

    try {
        const token = cookies().get("token")?.value || "";
        const data = jwt.verify(token, process.env.TOKEN_SECRET || '');

        if (!data) {
            return NextResponse.json({ error: 'Please include id token' }, { status: 401 })
        }

        const user = await UserDetail.create({ email, role, group })
        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.log(error)
    }
}