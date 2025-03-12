export const extractVideoId = (url) => {
    const embedPattern = /^https:\/\/www\.youtube\.com\/embed\/([\w-]{11})$/;
    const watchPattern = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([\w-]{11})/;
  
    const embedMatch = url.match(embedPattern);
    if (embedMatch) {
      return url;
    }
  
    const watchMatch = url.match(watchPattern);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
  
    return url;
  };