import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';

connectDB()

export async function GET(req: Request) {
    const email = req.url.split('?')[1].split('=')[1]

    try {
        const user = await UserDetail.findOne({ email }).exec()

        if (!user) {
            throw new Error('User not found')
        }

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}