import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';

connectDB()

async function calculateOverallResults (trial2Results: any) {
    // let results = {}
    // if (key === 'trial2') {
    //     // Calculate results
    //     results = {
    //         trial1: {
    //             numCorrect: { type: Number },
    //             accuracy: { type: Number },
    //             time: { type: Number }
    //         },
    //         trial2: {
    //             numCorrect: { type: Number },
    //             accuracy: { type: Number },
    //             time: { type: Number }
    //         }
    //     }
    // }
}

export async function PUT(req: Request, params: any) {
    const { id } = params
    const body = await req.json()
    const key = body.trial1 ? 'trial1' : 'trial2'
    const responses = body[key].responses

    let numCorrect = 0
    let totalTime = 0

    for (let i = 0; i < responses.length; i++) {
        const response = responses[i]
        if (response.isCorrect) {
            numCorrect += 1
        }
        totalTime += response.time
    }

    const results = {
        numCorrect,
        time: totalTime,
        accuracy: numCorrect / responses.length
    }

    // if (key === 'trial2') {
    //     await calculateOverallResults(responses)
    // }

    const user = await UserDetail.findOneAndUpdate(id, { 
        [key]: { 
            responses,
            results
        }
    })
    return NextResponse.json(user, { status: 200 })
}