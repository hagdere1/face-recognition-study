'use client'
import { Button } from "@mui/material";
import FaceSelection from "../FaceSelection";
import PreTrialSurvey from "../PreTrialSurvey";
import Results from "../Results";
import Slideshow from "../Slideshow/Slideshow";
import { useState } from "react";
import { useAuth } from "@/app/AuthProvider";

const PAGE = {
  PRE_TRIAL: 0,
  SLIDESHOW_1: 1,
  FACE_SELECTION_1: 2,
  SLIDESHOW_2: 3,
  FACE_SELECTION_2: 4,
  RESULTS: 5,
  POST_TRIAL: 6
}

const NEXT_PAGE = {
  [PAGE.PRE_TRIAL]: PAGE.SLIDESHOW_1,
  [PAGE.SLIDESHOW_1]: PAGE.FACE_SELECTION_1,
  [PAGE.FACE_SELECTION_1]: PAGE.SLIDESHOW_2,
  [PAGE.SLIDESHOW_2]: PAGE.FACE_SELECTION_2,
  [PAGE.FACE_SELECTION_2]: PAGE.RESULTS
}

export default function LoggedInRoutes() {
  const { user } = useAuth()

  const getCurrentPage = () => {
    if (!user?.surveyPreTrial) {
      return PAGE.PRE_TRIAL
    }
    if (!user.trial1) {
      return PAGE.SLIDESHOW_1
    }
    if (!user.trial2) {
      return PAGE.SLIDESHOW_2
    }
    if (!user.surveyPostTrial) {
      return PAGE.POST_TRIAL
    }
    return PAGE.RESULTS
  }

  const [page, setPage] = useState(getCurrentPage())
  // const [page, setPage] = useState(1)

  const [responses, setResponses] = useState({
      surveyPreTrial: [],
      trial1: [],
      trial2: [],
      surveyPostTrial: []
  })

  const goToNextPage = () => {
    const nextPage = NEXT_PAGE[page]

    if (nextPage) {
        setPage(nextPage)
    }
  }

  const setPreTrialResponses = async (values: any) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user?._id}/survey-responses`, {
        method: 'PUT', 
        headers: {
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
        
        goToNextPage()
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
        
        goToNextPage()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 36}}>
      <h1>Face Recognition Study</h1>
      <Button onClick={goToNextPage}>Skip</Button>

      {page === PAGE.PRE_TRIAL && (
        <PreTrialSurvey setPreTrialResponses={setPreTrialResponses} />
      )}

      {page === PAGE.SLIDESHOW_1 && (
        <Slideshow hasContext={false} goToNextPage={goToNextPage} />
      )}

      {page === PAGE.FACE_SELECTION_1 && (
        <FaceSelection hasContext={false} goToNextPage={goToNextPage} setTrialResponses={setTrial1Responses} />
      )}

      {page === PAGE.SLIDESHOW_2 && (
        <Slideshow hasContext={true} goToNextPage={goToNextPage} />
      )}

      {page === PAGE.FACE_SELECTION_2 && (
        <FaceSelection hasContext={true} goToNextPage={goToNextPage} setTrialResponses={setTrial2Responses} />
      )}

      {page === PAGE.RESULTS && (
        <Results trial1Responses={responses.trial1} trial2Responses={responses.trial2} />
      )}
    </main>
  );
}