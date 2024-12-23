import crypto from 'crypto'

export async function getImageHashFromUrl(url: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the image data as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();
    
    // Create a hash object
    const hash = crypto.createHash('sha256');
    
    // Update the hash with the image data
    hash.update(Buffer.from(imageBuffer));
    
    // Generate and return the hash as a hexadecimal string
    return hash.digest('hex');
  } catch (error) {
    console.error('Error fetching or hashing image:', error);
    throw error;
  }
}

export function calculateImageHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        if (!event.target || !event.target.result) {
          throw new Error('Failed to read file');
        }
        
        const buffer = event.target.result as ArrayBuffer;
        const hash = crypto.createHash('sha256');
        hash.update(Buffer.from(buffer));
        const hashHex = hash.digest('hex');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}