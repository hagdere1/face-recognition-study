import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';

connectDB()

export async function PUT(req: Request, { params }: any) {
    try {
        const body = await req.json()
        const emailRegex = new RegExp(`^${body.email}$`, 'i')

        const user = await UserDetail.findOne({ email: emailRegex })

        if (!user) {
            throw Error('User does not exist')
        }

        await UserDetail.findOneAndUpdate({ email: emailRegex }, { password: body.password }, { new: true })

        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}