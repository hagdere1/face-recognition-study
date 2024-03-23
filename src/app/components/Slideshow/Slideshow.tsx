'use client'
import { images_t1, images_t2 } from '../../../utils'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useTimer } from 'react-use-precision-timer';

type Persona = {
  context?: {
    sentence: string,
    hasFamily: boolean
  },
  emotionalValency: string,
  gender: string,
  id: number,
  image: string,
  name: string,
  race: string
}

type SlideshowProps = {
  hasContext: boolean
  goToNextPage: () => void
}

const trial1Instructions = "You will be presented with a slideshow of faces. Each image will be accompanied by a name belonging the person. Try to remember the combination of name and face."
const trial2Instructions = "You will now be presented with another slideshow of faces. Each image will be accompanied by a name as well as a sentence describing the person. Once again, try to remember the combination of name and face."

export default function Slideshow({ hasContext, goToNextPage }: SlideshowProps) {
  const [trialStarted, setTrialStarted] = useState(false)
  const [trialFinished, setTrialFinished] = useState(false)
  const [index, setIndex] = useState(0)

  const [data, setData] = useState<Persona[]>([])

  const instructions = hasContext ? trial2Instructions : trial1Instructions

  const images = hasContext ? images_t2 : images_t1

  const timer = useTimer({ delay: 5000 }, () => setIndex(currentValue => {
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
  }

  const fetchPersonasWithContext = async () => {
    const res = await fetch('/api/personas-context')
    const data = await res.json()
    setData(data)
  }

  useEffect(() => {
    if (hasContext) {
      fetchPersonasWithContext()
    } else {
      fetchPersonas()
    }
  }, [])

  const start = () => {
    setTrialStarted(true)
    timer.start()
  }

  const getImageSrc = (): string => {
    const personaImage = data[index].image

    const image = images.find(image => {
      const fileName = image.src.split('/').pop()
      const imageName = fileName?.split('.')[0]
      return personaImage === imageName
    })

    return image?.src || ""
  }

  if (!data.length) {
    return <div style={{ marginTop: 36 }}>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 700 }}>
      {!trialStarted && <h2 style={{ marginTop: 36, color: 'grey' }}>Trial {hasContext ? 2 : 1}</h2>}

      {!trialStarted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          <div>{instructions}</div>
          <Button variant="contained" onClick={start} style={{ marginTop: 24 }}>Start</Button>
        </div>
      )}

      {trialStarted && (
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: 16 }}><strong>{data[index].name}</strong></h3>

            {hasContext && (<div style={{ marginBottom: 24 }}>{data[index]?.context?.sentence}</div>)}

            <img
              key={getImageSrc()}
              src={getImageSrc()}
              alt="face-image"
              width={180}
              height={180}
            />
          </div>
        </div>
      )}
    </div>
  );
}