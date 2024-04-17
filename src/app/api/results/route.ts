import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { auth } from '../../firebase-admin';
import { headers } from "next/headers"
import { ROLE } from '@/app/constants/roles';

connectDB()

const getResults = (users: any[], role: string) => {
    const group = users.filter(user => user.role === role)
    const numOrphans = group.filter(user => user.group === 'orphan').length
    const numControl = group.filter(user => user.group === 'control').length

    const runningTotals = {
        orphan: {
            trial1: {
                time: 0,
                accuracy: 0
            },
            trial2: {
                time: 0,
                accuracy: 0
            },
            count: numOrphans
        },
        control: {
            trial1: {
                time: 0,
                accuracy: 0
            },
            trial2: {
                time: 0,
                accuracy: 0
            },
            count: numControl
        }
    }

    for (let i = 0; i < users.length; i++) {
        const user = users[i]

        if (user.group === 'orphan') {
            runningTotals.orphan.trial1.time += user.trial1.results.time
            runningTotals.orphan.trial1.accuracy += user.trial1.results.accuracy
            runningTotals.orphan.trial2.time += user.trial2.results.time
            runningTotals.orphan.trial2.accuracy += user.trial2.results.accuracy
        } else {
            runningTotals.control.trial1.time += user.trial1.results.time
            runningTotals.control.trial1.accuracy += user.trial1.results.accuracy
            runningTotals.control.trial2.time += user.trial2.results.time
            runningTotals.control.trial2.accuracy += user.trial2.results.accuracy
        }
    }

    const averages = { ...runningTotals }

    averages.orphan.trial1.time = runningTotals.orphan.trial1.time / numOrphans
    averages.orphan.trial1.accuracy = runningTotals.orphan.trial1.accuracy / numOrphans
    averages.orphan.trial2.time = runningTotals.orphan.trial2.time / numOrphans
    averages.orphan.trial2.accuracy = runningTotals.orphan.trial2.accuracy / numOrphans

    averages.control.trial1.time = runningTotals.control.trial1.time / numControl
    averages.control.trial1.accuracy = runningTotals.control.trial1.accuracy / numControl
    averages.control.trial2.time = runningTotals.control.trial2.time / numControl
    averages.control.trial2.accuracy = runningTotals.control.trial2.accuracy / numControl

    return averages
}

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
            role: "user",
            trial1: { $ne: null },
            trial2: { $ne: null }
        }).exec()

        const averages = getResults(users, ROLE.USER)
        const averagesTest = getResults(users, ROLE.TESTER)

        return NextResponse.json({
            user: averages,
            tester: averagesTest
        }, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}