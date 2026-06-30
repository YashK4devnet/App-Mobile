export const compressImage = (blob, maxWidth = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
    };
    img.onerror = reject;
  });
};
