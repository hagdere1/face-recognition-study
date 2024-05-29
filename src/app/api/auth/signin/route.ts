import { NextResponse } from 'next/server';
import UserDetail from '../../../../../models/UserDetail';
import connectDB from '../../../../../db';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

connectDB()

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json()
        const emailRegex = new RegExp(`^${body.email}$`, 'i')

        const user = await UserDetail.findOne({ email: emailRegex }).select('+password')

        if (!user) {
            throw Error('User does not exist')
        }

        const isPasswordMatch = await bcrypt.compare(body.password, user.password);
        if (!isPasswordMatch) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 400 }
          );
        }

        const tokenData = {
            email: user.email,
            password: user.password,
        };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET || '', {
            expiresIn: "30d",
        });

        const response = NextResponse.json(user, { status: 200 })
        response.cookies.set("token", token, { httpOnly: true });
        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json(false, { status: 500 })
    }
}