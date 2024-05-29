import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';
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

        // @ts-ignore
        const email = data.email

        const currentUser = await UserDetail.findOne({ email: new RegExp(`^${email}$`, 'i') })

        return NextResponse.json(currentUser, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}