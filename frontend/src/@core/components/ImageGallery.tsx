
// @ts-nocheck
import React, { useState, useEffect } from 'react';

const ImageGallery = ({ advertisementId }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Fetch image URLs from Cloudinary based on the advertisementId and set them in the state.
    const fetchImages = async () => {
      try {
        // const response = await fetch(`https://res.cloudinary.com/{dovfsnzn8}/image/upload/${advertisementId}/`);
        const response = await fetch(`https://res.cloudinary.com/v1_1/dovfsnzn8/resources/image/folder/${advertisementId}`);
        const data = await response.json();
        setImageUrls(data.resources);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [advertisementId]);

  return (
    <div>
      {imageUrls.map((imageUrl, index) => (
        <div key={index}>
          <img src={imageUrl.url} alt={`Image ${index}`} />
          <a href={imageUrl.url} download={`Image_${index}.jpg`}>
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
