import { useRef, useState, useEffect, useCallback } from 'react';
import Canvas from '@/components/Canvas';
import fetchWithRetry from "@/utils/fetchWithRetry";
import GameRef from '@/interfaces/GameRef';
import ImageState from '@/interfaces/ImageState';

function Create() {

  const gameRef = useRef<GameRef>({
    rectStart: { x: 0, y: 0 },
    rectEnd: { x: 0, y: 0 },
    gameSlug: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const [imageState, setImageState] = useState<ImageState>({
    selectedImage: null,
    imageUploadedSuccess: false,
    loadedImage: null,
    slug: "",
    title: "",
  });

  const [charNamesAndCoords, setCharNamesAndCoords] = useState([]);

  const [badCharSubmission, setBadCharSubmission] = useState({
    rectangle: false,
    width: false,
  });

  const [charSubmissionSuccess, setCharSubmissionSuccess] = useState(false);

  const submitGameHandler = async (e: Event) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", imageState.title);
    formData.append("slug", imageState.slug);

    if (imageState.selectedImage) {
      formData.append("image", imageState.selectedImage);
    } else {
      throw new Error("No image selected.");
    }
    
    let response;
    try {
      response = await fetchWithRetry({
        url: "/admin/",
        options: {
          method: "POST",
          body: formData,
        },
        
      });
    } catch (error) {
      
    }
  };

  const gameFormHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.currentTarget.id) {
      case "image-title":
        setImageState({ ...imageState, title: event.target.value });
        break;
      case "image-slug":
        setImageState({ ...imageState, slug: event.target.value });
        break;
      case "select-image":
        if (!event.target.files) {
          setErrors([...errors, "No file selected."]);
        } else {
          setErrors([]);
          setImageState({ ...imageState, selectedImage: event.target.files[0] });
        }
        break;
    }
  };



  return (
    <main>
      <h1>Create a game</h1>
      <form>
        <label htmlFor="image-title">
          <p>Please input a title for the new game</p>
          <input id="image-title"
            type="text"
            required={true}
            onChange={gameFormHandler}
          />
        </label>

        <label htmlFor="image-slug">
          <p>Please input a slug for the new game</p>
          <input id="image-slug"
            type="text"
            required={true}
            onChange={gameFormHandler}
          />
        </label>

        <label htmlFor="select-image">
          <p>Please select an image for the new game</p>
          <input id="select-image"
            type="file"
            onChange={gameFormHandler}
            required={true}
          >
          </input>
        </label>



      </form>
      {imageState.selectedImage && <Canvas file={imageState.selectedImage} gameRef={gameRef} imageState={imageState} />}
    </main>
  )
}

export default Create;