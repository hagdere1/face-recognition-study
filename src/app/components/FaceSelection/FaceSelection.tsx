'use client'
import { useEffect, useState } from "react";
import { getT1Images, getT2Images } from "@/utils/images";
import Button from '@mui/material/Button';
import { useStopwatch } from 'react-use-precision-timer';
import { useNavigationContext } from "@/app/NavigationProvider";

type Response = {
  isCorrect: boolean,
  time: number,
  persona: Persona,
  selectedPersonaId: number | null
}

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

type PhotoGridImageType = {
  src: string;
  width: number;
  height: number;
};

type FaceSelectionProps = {
  hasContext: boolean,
  setTrialResponses: (values: any) => void
}

export default function FaceSelection({ hasContext, setTrialResponses }: FaceSelectionProps) {
  const { proceed } = useNavigationContext()

  const [data, setData] = useState<Persona[]>([])

  const [responses, setResponses] = useState<Response[]>([])
 
  const [selectedImage, setSelectedImage] = useState("")

  const [nameIndex, setNameIndex] = useState(-1)
  const [isStarted, setIsStarted] = useState(false)

  const [isLoadingImageGrid, setIsLoadingImageGrid] = useState(true);
  const [loadedImages, setLoadedImages] = useState<PhotoGridImageType[]>([]);

  const stopwatch = useStopwatch();
  
  const shuffleImages = (images: PhotoGridImageType[]) => {
    return images.sort(() => Math.random() - 0.5)
  }

  const shufflePersonas = (personas: Persona[]) => {
    return personas.sort(() => Math.random() - 0.5)
  }

  const gridWidth = 600

  useEffect(() => {
    if (data.length && !isStarted) {
      setIsStarted(true)
      goToNextPerson()
    }
  }, [data.length])

  useEffect(() => {
     let loaded = 0;
     const images: PhotoGridImageType[] = []

     const images_t1 = getT1Images()
     const images_t2 = getT2Images()
     const trialImages = hasContext ? images_t2 : images_t1

     trialImages.forEach((image: any) => {
        var photo = new Image();
        photo.src = image.default.src;
        photo.onload = () => {
          images.push({ src: image.default.src, width: photo.naturalWidth, height: photo.naturalHeight });

          if (++loaded === trialImages.length) {
            const shuffledImages = shuffleImages(images)
            setLoadedImages(shuffledImages);
            setIsLoadingImageGrid(false);
          }
        };
     });
  }, []);

  const fetchPersonas = async () => {
    const res = await fetch('/api/personas')
    const data = await res.json()
    setData(shufflePersonas(data))
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

  useEffect(() => {
    if (data.length && responses.length === data.length) {
      setTrialResponses(responses)
    }
  }, [responses.length])

  const skip = () => {
    setSelectedImage("unsure")
    setResponses([
      ...responses, 
      {
        isCorrect: false,
        time: stopwatch.getElapsedStartedTime(),
        persona: data[nameIndex],
        selectedPersonaId: null
      }
    ])

    stopwatch.stop()
    setTimeout(goToNextPerson, 2000)
  }

  const selectImage = (src: string) => {
    const imageName = src.split('/').pop()?.split('.')[0]
    const persona = data[nameIndex]
    const selectedPersona = data.find(persona => persona.image === imageName) as Persona

    setResponses([
      ...responses, 
      {
        isCorrect: persona.id === selectedPersona.id,
        time: stopwatch.getElapsedStartedTime(),
        persona,
        selectedPersonaId: selectedPersona.id
      }
    ])

    stopwatch.stop()

    setSelectedImage(src)
    setTimeout(goToNextPerson, 2000)
  }

  const goToNextPerson = () => {
    setSelectedImage("")

    if (nameIndex + 1 < data.length) {
      setNameIndex(currentValue => currentValue + 1)
      setLoadedImages(shuffleImages(loadedImages))
      stopwatch.start()
    } else {
      proceed()
    }
  }

  if (!data.length || nameIndex < 0 || isLoadingImageGrid) {
    return null
  }

  const examplePersona = data[nameIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 700, marginTop: -16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 24, fontSize: 18 }}>Select <strong>{examplePersona.name}</strong>&rsquo;s face</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, height: gridWidth + 4, width: gridWidth }}>
            {loadedImages.map((image, index) => (
                <img
                    onClick={() => {
                      if (selectedImage) {
                        return
                      }
                      selectImage(image.src)
                    }}
                    key={image.src}
                    src={image.src}
                    alt="face"
                    style={{ 
                      cursor: selectedImage ? 'auto' : 'pointer', 
                      height: 'calc(16% - 2px)', 
                      width: 'calc(16% - 2px)', 
                      border: selectedImage === image.src ? "5px solid blue" : "none" 
                    }}
                />
            ))}
        </div>

        <div style={{ marginTop: 16, width: gridWidth }}>
            <Button disabled={!!selectedImage} fullWidth variant="contained" onClick={skip}>I&rsquo;m not sure</Button>
        </div>
      </div>
    </div>
  );
}