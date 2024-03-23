import mongoose from 'mongoose'

const UserDetailSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },

    group: { type: String, required: true },

    preTrial: {
        age: { type: Number },
        gender: { type: Number },
        ethnicity: { type: Number },
        familySize: { type: Number },
        parentsMaritalStatus: { type: Number },
        socialLife: { type: Number },
        numPeopleSpeakWith: { type: Number },
        numPeopleKnowWell: { type: Number },
        relationshipStatus: { type: Number },
        memoryNames: { type: Number },
        memoryFaces: { type: Number },
        orphanAdoptedAge: { type: Number },
        orphanTransitionProcess: { type: Number },
    },

    // postTrial: { type: String },

    resultsTrial1: [
        {
            name: { type: String },
            personaId: { type: String },
            isCorrect: { type: Boolean }
        }
    ],
    resultsTrial2: [
        {
            name: { type: String },
            personaId: { type: String },
            isCorrect: { type: Boolean }
        }
    ]
}, { timestamps: true })

export default mongoose.models.UserDetail || mongoose.model('UserDetail', UserDetailSchema)