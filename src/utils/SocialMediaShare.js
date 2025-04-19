export function SocialMediaShare({ currentUrl, text, media }) {
  const decodedUrl = decodeURIComponent(currentUrl);
  const decodedText = decodeURIComponent(text);
  switch (media) {
    case 'facebook':
      return `https://web.facebook.com/sharer.php?u=${decodedUrl}`;
    case 'x':
      return `https://x.com/intent/post?text=${decodedText}&url=${decodedUrl}`;
    case 'whatsapp': {
      const whatsappFormatted = `**${decodedText}**\n\n${decodedUrl}`;
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappFormatted)}`;
    }
    default:
      return '';
  }
}
