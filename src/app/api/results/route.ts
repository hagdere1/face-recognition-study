import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { ROLE } from '@/app/constants/roles';
import { getResultsForRole } from '../utils';
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

        // Get all the users
        const users = await UserDetail.find({
            surveyPostTrial: { $ne: null }
        }).exec()

        const averages = getResultsForRole(users, ROLE.USER)
        const averagesTest = getResultsForRole(users, ROLE.TESTER)

        return NextResponse.json({
            user: averages,
            tester: averagesTest
        }, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}