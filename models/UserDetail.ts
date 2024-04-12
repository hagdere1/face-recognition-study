import mongoose from 'mongoose'
import { PersonaSchema } from './Persona'

const SurveySchema = new mongoose.Schema({
    responses: [{
        questionId: { type: String },
        question: { type: String },
        response: { type: String }
    }]
})

const TrialSchema = new mongoose.Schema({
    responses: [{
        persona: PersonaSchema,
        selectedPersonaId: { type: String },
        isCorrect: { type: Boolean },
        time: { type: Number }
    }],
    results: {
        type: {
            numCorrect: { type: Number },
            accuracy: { type: Number },
            time: { type: Number }
        },
        default: null
    }
})

const UserDetailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    group: { type: String },
    surveyPreTrial: { type: SurveySchema, default: null },
    surveyPostTrial: { type: SurveySchema, default: null },
    trial1: { type: TrialSchema, default: null },
    trial2: { type: TrialSchema, default: null },
    results: {
        type: {
            accuracy: { type: Number },
            time: { type: Number }
        },
        default: null
    }
}, { timestamps: true })

export default mongoose.models.UserDetail || mongoose.model('UserDetail', UserDetailSchema)