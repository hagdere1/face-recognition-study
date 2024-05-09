import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { auth } from '../../firebase-admin';
import { headers } from "next/headers"
import { ROLE } from '@/app/constants/roles';
import { getResultsForRole } from '../utils';

connectDB()

export async function GET(req: Request) {
    const referer = headers().get("authorization");
  
    if (!referer) {
        return NextResponse.json({ error: 'Please include id token' }, { status: 401 });
    }

    try {
        const { uid } = await auth.verifyIdToken(referer.replace('Bearer ', ''));
        
        if (!uid) {
            throw Error('Unauthenticated')
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