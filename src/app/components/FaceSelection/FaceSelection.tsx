'use client'
import { useEffect, useState } from "react";
import { images as sourceImages } from '../../../utils'
import Button from '@mui/material/Button';
import { useStopwatch } from 'react-use-precision-timer';

type Persona = {
  context?: string,
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
  page: number,
  goToNextPage: () => void
}

export default function FaceSelection({ page, goToNextPage }: FaceSelectionProps) {
  const [data, setData] = useState<Persona[]>([])

  const [results, setResults] = useState<number[]>([])
 
  const [selectedImage, setSelectedImage] = useState("")

  const [nameIndex, setNameIndex] = useState(-1)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const [isLoadingImageGrid, setIsLoadingImageGrid] = useState(true);
  const [loadedImages, setLoadedImages] = useState<PhotoGridImageType[]>([]);

  const stopwatch = useStopwatch();
  
  const shuffleImages = (images: PhotoGridImageType[]) => {
    return images.sort(() => Math.random() - 0.5)
  }

  const gridWidth = 500

  useEffect(() => {
     let loaded = 0; // Initialise a counter
     const images: PhotoGridImageType[] = []

     sourceImages.forEach(({ src }) => {
        var photo = new Image();
        photo.src = src;
        photo.onload = () => {
          // Add loaded image to array
          images.push({ src, width: photo.naturalWidth, height: photo.naturalHeight });
          // Update the state

          // Up the loaded counter and compare
          if (++loaded === sourceImages.length) {
            const shuffledImages = shuffleImages(images)
            setLoadedImages(shuffledImages);
            // setLoadedImages(images)
            setIsLoadingImageGrid(false);
          }
        };
     });
  }, []);

  const fetchPersonas = async () => {
    const res = await fetch('/api/personas')
    const data = await res.json()
    setData(data)
  }

  useEffect(() => {
    fetchPersonas()
  }, [])

  const start = () => {
    setIsStarted(true)
    goToNextPerson()
  }

  const selectImage = (src: string) => {
    setResults([...results, stopwatch.getElapsedStartedTime()])
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
        setIsFinished(true)
    }
  }

  if (!data.length || isLoadingImageGrid) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 36 }}>Loading...</div>
  }

  if (isFinished) {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 36 }}>
      <div>Done!</div>
      <Button variant="contained" onClick={goToNextPage} style={{ marginTop: 24 }}>Continue</Button>
    </div>
  }

  const examplePersona = data[nameIndex]

  console.log("RESULTS: ", results)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36 }}>
      {!isStarted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            You will now be presented with a randomized grid of faces. Click on the face that corresponds with the given name. 
          </div>
          <Button variant="contained" onClick={start} style={{ marginTop: 24 }}>Start</Button>
        </div>
      )}

      {isStarted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: 24 }}>Select <strong>{examplePersona.name}</strong>'s face</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, height: gridWidth + 4, width: gridWidth }}>
              {loadedImages.map((image, index) => (
                  <>
                  {/* <div >{image.src}</div> */}
                  <img
                      onClick={() => {
                        if (selectedImage) {
                          return
                        }

                        if (image.src.includes(examplePersona.image)) {
                            // console.log(true)
                        } else {
                            // console.log(false)
                        }
                        selectImage(image.src)
                      }}
                      key={image.src}
                      src={image.src}
                      alt="face"
                      style={{ 
                        cursor: 'pointer', 
                        height: 'calc(33% - 2px)', 
                        width: 'calc(33% - 2px)', 
                        border: selectedImage === image.src ? "5px solid blue" : "none" 
                      }}
                  />
                  </>
              ))}
          </div>

          <div style={{ marginTop: 24, width: gridWidth }}>
              <Button fullWidth variant="contained">I'm not sure</Button>
          </div>
        </div>
      )}
    </div>
  );
}