import React, { useState } from "react";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ImageUploadComponent = ({ getImageUrl, title }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg")
    ) {
      document.body.classList.add("loading-indicator");
      setSelectedImage(file);

      // Upload image to Firebase Storage
      const imageRef = ref(storage, file.name);
      uploadBytes(imageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              getImageUrl(url);
              document.body.classList.remove("loading-indicator");
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
      document.body.classList.remove("loading-indicator");
    }
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-bold" htmlFor="imageUpload">
        Select an image (PNG/JPG): {title}
      </label>
      <input
        className="border p-2 mb-4"
        type="file"
        accept=".png,.jpg,.jpeg"
        id="imageUpload"
        onChange={handleImageUpload}
      />

      {selectedImage && (
        <div className="mb-4">
          <h2 className="font-bold">Selected Image of {title}</h2>
          <img
            className="mt-2 max-w-full"
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
