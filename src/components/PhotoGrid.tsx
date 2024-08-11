import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface PhotoGridProps {
  currentPhotos: string[];
  nextPhotos: string[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ currentPhotos, nextPhotos }) => {
  const [loadedCurrentPhotos, setLoadedCurrentPhotos] = useState<string[]>([]);
  const [preloadedNextPhotos, setPreloadedNextPhotos] = useState<string[]>([]);

  // Function to load images
  const loadImages = useCallback(async (photos: string[]) => {
    return await Promise.all(
      photos.map(url => 
        new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => {
            console.error(`Failed to load image: ${url}`);
            resolve('');
          };
          img.src = url;
        })
      )
    );
  }, []);

  // Load current images
  useEffect(() => {
    const loadCurrentImages = async () => {
      const loadedImages = await loadImages(currentPhotos);
      setLoadedCurrentPhotos(loadedImages);
    };

    if (currentPhotos.length > 0) {
      loadCurrentImages();
    } else {
      setLoadedCurrentPhotos([]);
    }
  }, [currentPhotos, loadImages]);

  // Preload next images
  useEffect(() => {
    const preloadNextImages = async () => {
      const preloadedImages = await loadImages(nextPhotos);
      setPreloadedNextPhotos(preloadedImages);
    };

    if (nextPhotos.length > 0) {
      preloadNextImages();
    } else {
      setPreloadedNextPhotos([]);
    }
  }, [nextPhotos, loadImages]);

  // Memoize the loaded current photos
  const photoElements = useMemo(() => 
    loadedCurrentPhotos.map((photo, index) => (
      <div key={index} className="photo-container">
        {photo ? (
          <img 
            src={photo} 
            alt={`Dog ${index + 1}`} 
            style={{ opacity: 1, transition: 'opacity 0.5s ease-in-out' }}
          />
        ) : (
          <div className="loading-placeholder">Loading...</div>
        )}
      </div>
    ))
  , [loadedCurrentPhotos]);

  return (
    <div className="photo-grid">
      {photoElements}
    </div>
  );
};

export default React.memo(PhotoGrid);
