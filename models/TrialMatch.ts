import mongoose from 'mongoose'

const TrialMatchSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    personaId: { type: String, required: true },
    withContext: { type: Boolean, required: true },
    time: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true }
}, { timestamps: true })

export default mongoose.models.TrialMatch || mongoose.model('TrialMatch', TrialMatchSchema)