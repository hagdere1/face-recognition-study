'use client'
import FaceSelection from "../FaceSelection";
import Survey from "../Survey";
import Results from "../Results";
import Slideshow from "../Slideshow/Slideshow";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import QuitDialog from "../QuitDialog";
import Instructions from "../Instructions";
import { INSTRUCTIONS } from '../../constants/instructions'
import { useNavigationContext } from "@/app/NavigationProvider";
import Cookies from 'js-cookie'
import { Button } from "@mui/material";

export default function LoggedInRoutes() {
  const { user } = useAuth()

  const { stepIndex, proceed, showQuitDialog, quit } = useNavigationContext()

  const [responses, setResponses] = useState({
      surveyPreTrial: null,
      trial1: null,
      trial2: null,
      surveyPostTrial: null
  })

  useEffect(() => {
    setResponses({
      surveyPreTrial: user?.surveyPreTrial,
      surveyPostTrial: user?.surveyPostTrial,
      trial1: user?.trial1,
      trial2: user?.trial2
    })
  }, [user])

  const setPreTrialResponses = async (values: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user?._id}/survey-responses`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ surveyPreTrial: { responses: values } })
      })

      if (res.ok) {
        const data = await res.json()
        setResponses({
          ...responses,
          surveyPreTrial: data
        })
        proceed()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const setTrial1Responses = async (values: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user?._id}/trial-responses`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ trial1: { responses: values } })
      })

      if (res.ok) {
        const data = await res.json()
        setResponses({
          ...responses,
          trial1: data
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const setTrial2Responses = async (values: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user?._id}/trial-responses`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ trial2: { responses: values } })
      })

      if (res.ok) {
        const data = await res.json()
        setResponses({
          ...responses,
          trial2: data
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const setPostTrialResponses = async (values: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user?._id}/survey-responses`, {
        method: 'PUT', 
        headers: {
            Authorization: `Bearer ${Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "")}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ surveyPostTrial: { responses: values } })
      })

      if (res.ok) {
        const data = await res.json()
        setResponses({
          ...responses,
          surveyPostTrial: data
        })
        proceed()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const quitStudy = async () => {
    quit()
  }

  if (!user) {
    return null
  }

  const STEPS = [
    <Instructions key={'step_0'} text={INSTRUCTIONS.START} />,
    <Survey key={'step_1'} setSurveyResponses={setPreTrialResponses} isPreTrial />,
    <Instructions key={'step_2'} text={INSTRUCTIONS.T1_SLIDESHOW_1} />,
    <Instructions key={'step_3'} text={INSTRUCTIONS.T1_SLIDESHOW_2} />,
    <Slideshow key={'step_4'} hasContext={false} />,
    <Instructions key={'step_5'} text={INSTRUCTIONS.T1_SLIDESHOW_3} />,
    <Instructions key={'step_6'} text={INSTRUCTIONS.T1_MATCHING_1} />,
    <FaceSelection key={'step_7'} hasContext={false} setTrialResponses={setTrial1Responses} />,
    <Instructions key={'step_8'} text={INSTRUCTIONS.T1_MATCHING_2} />,
    <Instructions key={'step_9'} text={INSTRUCTIONS.T2_1} />,
    <Instructions key={'step_10'} text={INSTRUCTIONS.T2_2} />,
    <Slideshow key={'step_11'} hasContext={true} />,
    <FaceSelection key={'step_12'} hasContext={true} setTrialResponses={setTrial2Responses} />,
    <Instructions key={'step_13'} text={INSTRUCTIONS.T2_3} />,
    // @ts-ignore
    <Results key={'step_14'} trial1Results={responses.trial1?.results} trial2Results={responses.trial2?.results} />,
    <Instructions key={'step_15'} text={INSTRUCTIONS.POSTTRIAL_SURVEY} />,
    <Survey key={'step_16'} setSurveyResponses={setPostTrialResponses} isPreTrial={false} />,
    <Instructions key={'step_17'} text={INSTRUCTIONS.END} hideButtons />
  ]

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 36}}>
      <h1>Face Recognition Study</h1>
      {/* {user.role === 'admin' && stepIndex < STEPS.length - 1 && (
        <>
          <Button onClick={proceed}>Skip</Button>
          <div><strong>STEP INDEX: {stepIndex}</strong></div>
        </>
      )} */}

      {user.quit ? <Instructions text={INSTRUCTIONS.QUIT} hideButtons /> : STEPS[stepIndex]}

      <QuitDialog isOpen={showQuitDialog} confirm={quitStudy} />
    </main>
  );
}