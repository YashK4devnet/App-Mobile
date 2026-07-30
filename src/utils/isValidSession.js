export const isValidSession = () => {
  const savedData = localStorage.getItem("loginData");
  if (!savedData) return false;

  try {
    const parsedData = JSON.parse(savedData);
    const apiKey = parsedData["api-key"] || parsedData["api-Key"] || parsedData["api_key"] || localStorage.getItem("serverApiKey");

    // Ensure apiKey exists and has some expected format
    return typeof apiKey === "string" && apiKey.length > 10;
  } catch (error) {
    return false;
  }
};
