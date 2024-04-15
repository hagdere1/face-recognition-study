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
    <Instructions text={INSTRUCTIONS.START} />,
    <Survey setSurveyResponses={setPreTrialResponses} isPreTrial />,
    <Instructions text={INSTRUCTIONS.T1_SLIDESHOW_1} />,
    <Instructions text={INSTRUCTIONS.T1_SLIDESHOW_2} />,
    <Slideshow hasContext={false} />,
    <Instructions text={INSTRUCTIONS.T1_SLIDESHOW_3} />,
    <Instructions text={INSTRUCTIONS.T1_MATCHING_1} />,
    <FaceSelection hasContext={false} setTrialResponses={setTrial1Responses} />,
    <Instructions text={INSTRUCTIONS.T1_MATCHING_2} />,
    <Instructions text={INSTRUCTIONS.T2_1} />,
    <Instructions text={INSTRUCTIONS.T2_2} />,
    <Slideshow hasContext={true} />,
    <FaceSelection hasContext={true} setTrialResponses={setTrial2Responses} />,
    <Instructions text={INSTRUCTIONS.T2_3} />,
    // @ts-ignore
    <Results trial1Results={responses.trial1?.results} trial2Results={responses.trial2?.results} />,
    <Instructions text={INSTRUCTIONS.POSTTRIAL_SURVEY} />,
    <Survey setSurveyResponses={setPostTrialResponses} isPreTrial={false} />,
    <Instructions text={INSTRUCTIONS.END} hideButtons />
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