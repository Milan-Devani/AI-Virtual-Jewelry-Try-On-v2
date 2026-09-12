export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MIN_DIMENSION = 256;
export const RECOMMENDED_DIMENSION = 512;

export interface ClientValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

export async function validateClientImage(file: File): Promise<ClientValidationResult> {
  if (!file) {
    return { valid: false, error: "Please select an image file." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Unsupported image format. Please upload JPG, PNG, or WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Maximum image size is 8 MB.",
    };
  }

  // Dimension & Readability check
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        resolve({
          valid: false,
          error: `Image is too small (${img.width}x${img.height}px). Recommended minimum is ${RECOMMENDED_DIMENSION}x${RECOMMENDED_DIMENSION}px.`,
          width: img.width,
          height: img.height,
        });
      } else {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: "Unable to read image file. It may be corrupted.",
      });
    };

    img.src = objectUrl;
  });
}
