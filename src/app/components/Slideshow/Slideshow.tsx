'use client'
import { images } from '../../../utils'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useTimer } from 'react-use-precision-timer';

type SlideshowProps = {
  page: number
  goToNextPage: () => void
}

export default function Slideshow({ page, goToNextPage }: SlideshowProps) {
  const [trialStarted, setTrialStarted] = useState(false)
  const [trialFinished, setTrialFinished] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const [data, setData] = useState()

  const timer = useTimer({ delay: 5000 }, () => setImageIndex(currentValue => {
    if (currentValue < images.length - 1) {
      return currentValue + 1 
    } else {
      setTrialFinished(true)
      return currentValue
    }
  }));

  useEffect(() => {
    if (trialFinished) {
      timer.stop()
      goToNextPage()
    }
  }, [trialFinished])

  const fetchPersonas = async () => {
    const res = await fetch('/api/personas')
    const data = await res.json()
    setData(data)
    console.log(data)
  }

  const start = () => {
    setTrialStarted(true)
    timer.start()
  }

  useEffect(() => {
    fetchPersonas()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {!trialStarted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
          <div>
            You will be presented with a slideshow of faces. Each face will be accompanied by a name. Try to remember the combination of name and face.
          </div>
          <Button variant="contained" onClick={start} style={{ marginTop: 24 }}>Start</Button>
        </div>
      )}

      {trialStarted && (
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 24 }}>Image #{imageIndex + 1}</div>

            <img
              key={images[imageIndex].src}
              src={images[imageIndex].src}
              alt="Next.js Logo"
              width={180}
              height={180}
            />
          </div>
        </div>
      )}
    </div>
  );
}