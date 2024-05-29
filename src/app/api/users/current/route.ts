import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

connectDB()

export async function GET(req: Request) {
    try {
        const token = cookies().get("token")?.value || "";

        if (!token) {
            throw Error('Please include id token')
        }
        
        const data = jwt.verify(token, process.env.TOKEN_SECRET || '');

        if (!data) {
            throw Error('Invalid id token')
        }

        // @ts-ignore
        const email = data.email

        const currentUser = await UserDetail.findOne({ email: new RegExp(`^${email}$`, 'i') })

        return NextResponse.json(currentUser, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}