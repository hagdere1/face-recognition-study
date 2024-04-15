import { NextResponse } from 'next/server';
import UserDetail from '../../../../../../models/UserDetail';
import connectDB from '../../../../../../db';
import { auth } from '../../../../firebase-admin';
import { headers } from "next/headers"

connectDB()

function getResults(responses: any) {
    let numCorrect = 0
    let totalTime = 0

    for (let i = 0; i < responses.length; i++) {
        const response = responses[i]
        if (response.isCorrect) {
            numCorrect += 1
        }
        totalTime += response.time
    }

    return {
        numCorrect,
        time: totalTime,
        accuracy: numCorrect / responses.length
    }
}

export async function PUT(req: Request, { params }: any) {
    const referer = headers().get("authorization");
  
    if (!referer) {
        return NextResponse.json({ error: 'Please include id token' }, { status: 401 });
    }

    try {
        const { uid } = await auth.verifyIdToken(referer.replace('Bearer ', ''));
        
        if (!uid) {
            throw Error('Unauthenticated')
        }

        const { id } = params
        
        const body = await req.json()
        const key = body.trial1 ? 'trial1' : 'trial2'
        const responses = body[key].responses
        const results = getResults(responses)
    
        const user = await UserDetail.findOneAndUpdate({ _id: id }, { 
            [key]: { 
                responses,
                results
            }
        }, { new: true })

        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error)
    }
}