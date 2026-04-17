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
      // Mantém o formato original para evitar aumento de tamanho
      fileType: file.type,
      quality: 0.8 // Qualidade mais equilibrada para JPEG/PNG
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const originalExtension = file.name.split('.').pop();
      return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + "." + originalExtension, {
        type: file.type,
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