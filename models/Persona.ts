import mongoose from 'mongoose'

export const PersonaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    gender: { type: String, required: true },
    race: { type: String, required: true },
    emotionalValence: { type: String, required: true },
    contextSentence: { type: String },
    contextFamily: { type: Boolean },
}, { timestamps: true })

export default mongoose.models.Persona || mongoose.model('Persona', PersonaSchema)