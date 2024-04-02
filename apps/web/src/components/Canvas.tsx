import { useEffect, useCallback, useState, useRef } from 'react';
import GameRef from '@/interfaces/GameRef';
import ImageState from '@/interfaces/ImageState';

function Canvas(props: { file: File, gameRef: React.MutableRefObject<GameRef>, imageState: ImageState }) {
  interface CompletedCharRect {
    startX: number;
    startY: number;
    width: number;
    height: number;
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  const [isDrawing, setIsDrawing] = useState(false);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [completedCharRects, setCompletedCharRects] = useState<CompletedCharRect[]>([]);

  useEffect(() => {
    // Draws the uploaded image on the canvas upon successful upload
    // by calling the drawImageOnCanvas() function
    const image = new Image();

    // Draw the image on the canvas upon successful upload of the image
    if (props.imageState.imageUploadedSuccess && props.imageState.selectedImage) {
      image.src = URL.createObjectURL(props.imageState.selectedImage);
      image.onload = () => {
        drawImageOnCanvas(image);
        setLoadedImage(image);
      };
    }

    // Resize the canvas/image upon window resize
    const handleResize = () => {
      if (props.imageState.imageUploadedSuccess && props.imageState.selectedImage) {
        drawImageOnCanvas(image);
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);

      // Cleanup the object URL to prevent memory leaks
      if (props.imageState.imageUploadedSuccess) {
        URL.revokeObjectURL(image.src);
      }
    };
  }, [props.imageState.imageUploadedSuccess, props.imageState.selectedImage]);

  const drawImageOnCanvas = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Calculate the aspect ratio of the image
    const aspectRatio = image.naturalWidth / image.naturalHeight;

    // Adjust canvas size
    canvas.width = window.innerWidth * 0.8;
    canvas.height = canvas.width / aspectRatio;

    // Draw the image
    ctx!.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw rectangles for any previously completed characters
  };

  const redrawCompletedRects = useCallback(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;

    completedCharRects.forEach((rect) => {
      ctx.beginPath();
      ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.closePath();
    });
  }, [completedCharRects]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / rect.width;
      const currentY = (e.clientY - rect.top) / rect.height;
      props.gameRef.current.rectEnd = { x: currentX, y: currentY };

      // Clear the canvas and redraw the image
      const ctx = canvasRef.current.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Use the loaded image directly
      if (loadedImage) {
        ctx.drawImage(
          loadedImage,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }

      // Draw the new rectangle
      ctx.beginPath();
      ctx.rect(
        props.gameRef.current.rectStart.x * rect.width,
        props.gameRef.current.rectStart.y * rect.height,
        (currentX - props.gameRef.current.rectStart.x) * rect.width,
        (currentY - props.gameRef.current.rectStart.y) * rect.height
      );
      ctx.strokeStyle = "red";
      ctx.stroke();
     
      redrawCompletedRects();
    },
    [isDrawing, loadedImage, redrawCompletedRects]
  );

  const handleMouseUp = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.target !== canvas) return;
    if (e.target !== canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let endX = (e.clientX - rect.left) / rect.width;
    let endY = (e.clientY - rect.top) / rect.height;
    // rectEndRef.current = { x: endX, y: endY };
    props.gameRef.current.rectEnd = { x: endX, y: endY };
    setIsDrawing(false);
  }, []);

  // Mouse down event to start the rectangle

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || e.target !== canvas) return;
      if (e.target !== canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const startX = (e.clientX - rect.left) / rect.width;
      const startY = (e.clientY - rect.top) / rect.height;
      props.gameRef.current.rectStart = { x: startX, y: startY };
      setIsDrawing(true);
    },
    [setIsDrawing, canvasRef]
  );

  // Add event listeners to the canvas element for handling the drawing of
  // the rectangle and getting coordinates from the image
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp); // Added to document to handle mouse release outside canvas

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing, handleMouseMove, handleMouseUp, handleMouseDown]);

  return (
    <canvas>

    </canvas>
  )
};

export default Canvas;