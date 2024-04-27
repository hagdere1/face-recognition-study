import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { auth } from '../../firebase-admin';
import { headers } from "next/headers"
import { ROLE } from '@/app/constants/roles';
import { getResultsForRole } from '../utils';
import { PRETRIAL_QUESTIONS } from '@/app/constants/questions';

connectDB()

const getPreTrialSurveyResults = (users: any[]) => {
    const allResults: any[] = []

    PRETRIAL_QUESTIONS.forEach((question, questionIndex) => {
        const questionResults = {
            id: question.id,
            question: question.question,
            results: [] as any[]
        }

        question.options.forEach(option => {
            const optionUsers = users.filter(user => user.surveyPreTrial.responses[questionIndex].response === option)
            const averages = getResultsForRole(optionUsers, ROLE.USER)
            const averagesTest = getResultsForRole(optionUsers, ROLE.TESTER)

            questionResults.results.push({
                option,
                user: averages,
                tester: averagesTest
            })
        })

        allResults.push(questionResults)
    })

    return allResults
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
            trial1: { $ne: null },
            trial2: { $ne: null }
        }).exec()

        return NextResponse.json({
            surveyPreTrial: getPreTrialSurveyResults(users)
        }, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}