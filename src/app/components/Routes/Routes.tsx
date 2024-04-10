'use client'
import { Button } from "@mui/material";
import FaceSelection from "../FaceSelection";
import PreTrialSurvey from "../PreTrialSurvey";
import Results from "../Results";
import Slideshow from "../Slideshow/Slideshow";
import { useEffect, useState } from "react";

const PAGE = {
  PRE_TRIAL: 0,
  SLIDESHOW_1: 1,
  FACE_SELECTION_1: 2,
  SLIDESHOW_2: 3,
  FACE_SELECTION_2: 4,
  RESULTS: 5,
//   POST_TRIAL: 6
}

const NEXT_PAGE = {
  [PAGE.PRE_TRIAL]: PAGE.SLIDESHOW_1,
  [PAGE.SLIDESHOW_1]: PAGE.FACE_SELECTION_1,
  [PAGE.FACE_SELECTION_1]: PAGE.SLIDESHOW_2,
  [PAGE.SLIDESHOW_2]: PAGE.FACE_SELECTION_2,
  [PAGE.FACE_SELECTION_2]: PAGE.RESULTS
}

type RoutesProps = {
    currentPage: number
}

export default function Routes({ currentPage }: RoutesProps) {
    const [page, setPage] = useState(currentPage)

    const [responses, setResponses] = useState({
        preTrial: [],
        trial1: [],
        trial2: [],
        postTrial: []
    })

  const goToNextPage = () => {
    const nextPage = NEXT_PAGE[page]

    if (nextPage) {
        setPage(nextPage)
    }
  }

  const setPreTrialResponses = (values: any) => {
    setResponses({
        ...responses,
        preTrial: values
    })
    // API call
  }

  const setTrial1Responses = (values: any) => {
    setResponses({
        ...responses,
        trial1: values
    })
    // API call
  }

  const setTrial2Responses = (values: any) => {
    setResponses({
        ...responses,
        trial2: values
    })
    // API call
  }

  const setPostTrialResponses = (values: any) => {
    setResponses({
        ...responses,
        postTrial: values
    })
    // API call
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 36}}>
      <h1>Face Recognition Study</h1>
      <Button onClick={goToNextPage}>Skip</Button>

      {page === PAGE.PRE_TRIAL && (
        <PreTrialSurvey />
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