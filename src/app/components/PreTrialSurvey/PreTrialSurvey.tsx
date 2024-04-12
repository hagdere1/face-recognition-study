import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';
import { useAuth } from '@/app/AuthProvider';
import { SyntheticEvent, useState } from 'react';

const QUESTIONS = [
    {
        id: "age",
        question: "What is your current age?",
        options: [
            "18-28",
            "29-38",
            "39-48",
            "49-58",
            "59-65"
        ]
    },
    {
        id: "gender",
        question: "Which most accurately describes your gender?",
        options: [
            "Male",
            "Female",
            "Non-Binary",
            "Prefer not to say"
        ]
    },
    {
        id: "ethnicity",
        question: "What is your ethnicity?",
        options: [
            "White (non-Hispanic)",
            "Hispanic",
            "Black",
            "Asian",
            "Multi-Racial",
            "Other"
        ]
    },
    {
        id: "familySize",
        question: "How would you describe the size of your current family?",
        options: [
            "Small (only child)",
            "Medium (1-2 siblings)",
            "Large (2+ siblings)"
        ]
    },
    {
        id: "parentsMaritalStatus",
        question: "What is the marital status of your parents?",
        options: [
            "Married",
            "Separated",
            "Divorced"
        ]
    },
    {
        id: "socialLife",
        question: "How would you describe your social life?",
        options: [
            "I keep to myself",
            "I have one best friend",
            "I have a few close friends who I primarily interact with",
            "I have a groups of friends with whom I enjoy spending time",
            "I am very social"
        ]
    },
    {
        id: "numDailyPeopleSpeaking",
        question: "Roughly how many people do you speak with, on average, each day?",
        options: [
            "Zero",
            "Below an average amount (work solitarily most of the time)",
            "An average amount (work with a few people regularly)",
            "More than an average amount (meeting with small teams regularly)",
            "A large amount (interacting with groups of people)"
        ]
    },
    {
        id: "dailyPeopleSpeakingKnowWell",
        question: "Of the people you speak with each day, how many would you say know you well?",
        options: [
            "Zero",
            "Not much (work solitarily most of the time)",
            "A moderate amount (meeting with small teams regularly)",
            "A large amount (interacting with groups of people)"
        ]
    },
    {
        id: "relationshipStatus",
        question: "What is your relationship status?",
        options: [
            "Single",
            "In a relationship",
            "Engaged",
            "Married",
            "Divorced"
        ]
    },
    {
        id: "memoryNames",
        question: "How would you rate your memory with people’s names?",
        options: [
            "Very below average",
            "Below average",
            "Average",
            "Above average",
            "Very above average"
        ]
    },
    {
        id: "memoryFaces",
        question: "How would you rate your memory with people’s faces?",
        options: [
            "Very below average",
            "Below average",
            "Average",
            "Above average",
            "Very above average"
        ]
    }
]
const QUESTIONS_ORPHAN = [
    {
        id: "adoptedAge",
        question: "At what age were you adopted/displaced?",
        options: [
            "1-3",
            "4-6",
            "7-10",
            "11-13"
        ]
    },
    {
        id: "adoptedTransitionProcess",
        question: "How would you best describe the transition process?",
        options: [
            "Simple",
            "Some challenges",
            "Very difficult"
        ]
    },
]

type PreTrialSurveyProps = {
    setPreTrialResponses: (values: any) => void
}

export default function PreTrialSurvey({ setPreTrialResponses }: PreTrialSurveyProps) {
    const { user } = useAuth()

    const allQuestions = [
        ...QUESTIONS,
        ...(user?.group === 'orphan' ? QUESTIONS_ORPHAN : [])
    ]

    const initialState = allQuestions.map(question => ({ id: question.id, question: question.question, response: '' }))

    const [responses, setResponses] = useState(initialState)

    const handleChange = (event: SyntheticEvent<Element, Event>, questionIndex: number) => {
        const updatedResponses = [...responses]
        updatedResponses[questionIndex].response = (event.target as HTMLInputElement).value
        setResponses(updatedResponses);
    };    

    const submit = () => {
        const isValid = validate()
        if (isValid) {
            setPreTrialResponses(responses)
        }
    }

    const validate = () => {
        return responses.every(response => response.response)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36, width: 700 }}>
            <h2 style={{ color: 'grey', marginBottom: 36 }}>Pre-Trial Survey</h2>

            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <FormControl>
                    {allQuestions.map(({ question, options }, questionIndex) => (
                        <div key={question} style={{ marginBottom: 36 }}>
                            <FormLabel id="demo-radio-buttons-group-label" style={{ marginBottom: 8 }}>{question}</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                            >
                                {options.map((option) => <FormControlLabel key={`${question}_${option}`} value={option} control={<Radio />} label={option} onChange={(e) => handleChange(e, questionIndex)} />)}
                            </RadioGroup>
                        </div>
                    ))}

                    <Button disabled={!validate()} onClick={submit} style={{ marginTop: 24 }} variant='contained'>Submit</Button>
                </FormControl>
            </div>
        </div>
    )
}