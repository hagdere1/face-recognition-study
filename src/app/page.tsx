'use client'
import FaceSelection from "./components/FaceSelection";
import Results from "./components/Results";
import Slideshow from "./components/Slideshow/Slideshow";
import { useEffect, useState } from "react";

const PAGE = {
  SLIDESHOW_1: 0,
  FACE_SELECTION_1: 1,
  SLIDESHOW_2: 2,
  FACE_SELECTION_2: 3,
  RESULTS: 4
}

const NEXT_PAGE = {
  [PAGE.SLIDESHOW_1]: PAGE.FACE_SELECTION_1,
  [PAGE.FACE_SELECTION_1]: PAGE.SLIDESHOW_2,
  [PAGE.SLIDESHOW_2]: PAGE.FACE_SELECTION_2,
  [PAGE.FACE_SELECTION_2]: PAGE.RESULTS
}

export default function Home() {
  const [page, setPage] = useState(1)

  const [trial1Responses, setTrial1Responses] = useState([])
  const [trial2Responses, setTrial2Responses] = useState([])

  const goToNextPage = () => {
    const nextPage = NEXT_PAGE[page]

    setPage(nextPage)
  }

  const submitResponses = async () => {
    const payload = {
      trial1: trial1Responses,
      trial2: trial2Responses
    }

    console.log(payload)

    // TO DO
  }

  useEffect(() => {
    if (trial2Responses.length) {
      submitResponses()
    }
  }, [trial2Responses])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 36}}>
      <h1>Face Recognition Study</h1>

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
        <Results trial1Responses={trial1Responses} trial2Responses={trial2Responses} />
      )}
    </main>
  );
}