const CLOUD_NAME = 'dczqllfsy';

/**
 * Builds a Cloudinary URL for a given local path.
 * If the path starts with http, it returns as is.
 * Otherwise, it constructs a Cloudinary URL.
 */
export const getCloudinaryUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct the Cloudinary URL
  // We assume the images are in the root folder of Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${cleanPath}`;
};
