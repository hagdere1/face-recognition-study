import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';
import { useAuth } from '@/app/AuthProvider';
import { SyntheticEvent, useState } from 'react';
import { POSTTRIAL_QUESTIONS, PRETRIAL_QUESTIONS, PRETRIAL_QUESTIONS_ORPHAN } from '../../constants/questions'

type SurveyProps = {
    isPreTrial: boolean,
    setSurveyResponses: (values: any) => void
}

export default function Survey({ setSurveyResponses, isPreTrial }: SurveyProps) {
    const { user } = useAuth()

    const getQuestions = () => {
        if (isPreTrial) {
            return user?.group === 'orphan' ? PRETRIAL_QUESTIONS_ORPHAN : PRETRIAL_QUESTIONS
        } else {
            return POSTTRIAL_QUESTIONS
        }
    }

    const questions = getQuestions()

    const initialState = questions.map(question => ({ id: question.id, question: question.question, response: '' }))

    const [responses, setResponses] = useState(initialState)

    const handleChange = (event: SyntheticEvent<Element, Event>, questionIndex: number) => {
        const updatedResponses = [...responses]
        updatedResponses[questionIndex].response = (event.target as HTMLInputElement).value
        setResponses(updatedResponses);
    };    

    const submit = () => {
        const isValid = validate()
        if (isValid) {
            setSurveyResponses(responses)
        }
    }

    const validate = () => {
        return responses.every(response => response.response)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 700 }}>
            <h2 style={{ color: 'grey', marginBottom: 36 }}>{isPreTrial ? 'Pre-Trial' : 'Post-Trial'} Survey</h2>

            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <FormControl>
                    {questions.map(({ question, options }, questionIndex) => (
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

                    <Button disabled={!validate()} onClick={submit} style={{ margin: '24px 0' }} variant='contained'>Submit</Button>
                </FormControl>
            </div>
        </div>
    )
}