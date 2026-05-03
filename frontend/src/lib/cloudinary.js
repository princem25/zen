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
  
  // Construct the Cloudinary URL with optimization settings
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${cleanPath}`;
};

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The Cloudinary public ID or secure URL
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // You might need to change this if your preset is different

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    // Return the public_id or the full URL. 
    // Since our app uses getCloudinaryUrl, returning the version + public_id is best.
    return `v${data.version}/${data.public_id}.${data.format}`;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
