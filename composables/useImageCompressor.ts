import imageCompression from 'browser-image-compression';

export const useImageCompressor = () => {
  const compressImage = async (file: File) => {
    //Se não for imagem, retorna o original
    if (!file || !file.type.startsWith('image/')) {
      return file;
    }

    const options = {
      maxSizeMB: 1, // 1MB máximo
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' as any,
      quality: 1 // Qualidade reduzida
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
        type: 'image/webp',
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Erro na compressão global:", error);
      return file;
    }
  };

  return {
    compressImage
  };
};