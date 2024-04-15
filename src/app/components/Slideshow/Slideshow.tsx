'use client'
import { images_t1, images_t2 } from '../../../utils'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useTimer } from 'react-use-precision-timer';
import { useNavigationContext } from '@/app/NavigationProvider';

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
}

export default function Slideshow({ hasContext }: SlideshowProps) {
  const { proceed } = useNavigationContext()

  const [trialStarted, setTrialStarted] = useState(false)
  const [trialFinished, setTrialFinished] = useState(false)
  const [index, setIndex] = useState(0)

  const [data, setData] = useState<Persona[]>([])

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
      proceed()
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

  useEffect(() => {
    if (data && !trialStarted) {
      start()
    }
  }, [data])

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
    // return <div style={{ marginTop: 36 }}>Loading...</div>
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 700 }}>
      {!trialStarted && <h2 style={{ marginTop: 36, color: 'grey' }}>Trial {hasContext ? 2 : 1}</h2>}

      <div style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: 16 }}><strong>{data[index].name}</strong></h3>

          {hasContext && (<div style={{ marginBottom: 24 }}>{data[index]?.context?.sentence}</div>)}

          <img
            key={getImageSrc()}
            src={getImageSrc()}
            alt="face-image"
            width={260}
            height={260}
          />
        </div>
      </div>
    </div>
  );
}