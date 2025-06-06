import { NextResponse } from 'next/server';
import UserDetail from '../../../../models/UserDetail';
import connectDB from '../../../../db';
import { auth } from '../../firebase-admin';
import { headers } from "next/headers"
import { ROLE } from '@/app/constants/roles';
import { getResultsForRole, getTrialResultsForAttribute } from '../utils';
import { POSTTRIAL_QUESTIONS, PRETRIAL_QUESTIONS_ORPHAN } from '@/app/constants/questions';

connectDB()

const getPreTrialSurveyResults = (users: any[]) => {
    const allResults: any[] = []

    PRETRIAL_QUESTIONS_ORPHAN.forEach((question, questionIndex) => {
        const questionResults = {
            id: question.id,
            question: question.question,
            results: [] as any[]
        }

        question.options.forEach(option => {
            const optionUsers = users.filter(user => user.surveyPreTrial.responses[questionIndex]?.response === option)
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

const getPostTrialSurveyResults = (users: any[]) => {
    const allResults: any[] = []

    POSTTRIAL_QUESTIONS.forEach((question, questionIndex) => {
        const questionResults = {
            id: question.id,
            question: question.question,
            results: [] as any[]
        }

        question.options.forEach(option => {
            const optionUsers = users.filter(user => user.surveyPostTrial.responses[questionIndex].response === option)
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

const getTrialResults = (users: any[]) => {
    const allResults: any[] = []

    const attributes = [
        ['race', 'white'], 
        ['race', 'non-white'], 
        ['gender', 'male'],
        ['gender', 'female'],
        ['emotionalValency', 'positive'],
        ['emotionalValency', 'neutral'],
        ['emotionalValency', 'negative'],
        ['hasFamily', true],
        ['hasFamily', false]
    ]

    const getAttributeName = (attribute: any[]) => {
        let value = attribute[1]
        if (typeof value === 'boolean') {
            value = value.toString()
        }
        return attribute[0][0].toUpperCase() + attribute[0].substring(1) + ': ' + value[0].toUpperCase() + value.substring(1)
    }

    attributes.forEach((attribute: any[]) => {
        const averages = getTrialResultsForAttribute(users, ROLE.USER, attribute)
        const averagesTest = getTrialResultsForAttribute(users, ROLE.TESTER, attribute)

        const result = {
            attributeName: getAttributeName(attribute),
            tester: averagesTest,
            user: averages
        }

        allResults.push(result)
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
            surveyPostTrial: { $ne: null }
        }).exec()

        return NextResponse.json({
            surveyPreTrial: getPreTrialSurveyResults(users),
            surveyPostTrial: getPostTrialSurveyResults(users),
            trials: getTrialResults(users)
        }, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}