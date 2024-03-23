'use client'
import FaceSelection from "./components/FaceSelection";
import Finished from "./components/Finished";
import Slideshow from "./components/Slideshow/Slideshow";
import { useState } from "react";

const PAGE = {
  SLIDESHOW_1: 0,
  FACE_SELECTION_1: 1,
  SLIDESHOW_2: 2,
  FACE_SELECTION_2: 3,
  FINISHED: 4
}

const NEXT_PAGE = {
  [PAGE.SLIDESHOW_1]: PAGE.FACE_SELECTION_1,
  [PAGE.FACE_SELECTION_1]: PAGE.SLIDESHOW_2,
  [PAGE.SLIDESHOW_2]: PAGE.FACE_SELECTION_2,
  [PAGE.FACE_SELECTION_2]: PAGE.FINISHED
}

export default function Home() {
  const [page, setPage] = useState(0)

  const goToNextPage = () => {
    setPage(NEXT_PAGE[page])
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 36}}>
      <h1>Face Recognition Study</h1>

      {page === 0 && (
        <Slideshow page={0} goToNextPage={goToNextPage} />
      )}

      {page === 1 && (
        <FaceSelection page={1} goToNextPage={goToNextPage} />
      )}

      {page === 2 && (
        <Slideshow page={2} goToNextPage={goToNextPage} />
      )}

      {page === 3 && (
        <FaceSelection page={3} goToNextPage={goToNextPage} />
      )}

      {page === 4 && (
        <Finished />
      )}
    </main>
  );
}