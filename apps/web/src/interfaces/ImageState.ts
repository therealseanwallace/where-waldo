interface ImageState {
  selectedImage: File | null;
  imageUploadedSuccess: boolean;
  loadedImage: string | null;
  slug: string;
  title: string;
}

export default ImageState;