function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString + 'Z');
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'tahun', seconds: 31536000 },
    { label: 'bulan', seconds: 2592000 },
    { label: 'minggu', seconds: 604800 },
    { label: 'hari', seconds: 86400 },
    { label: 'jam', seconds: 3600 },
    { label: 'menit', seconds: 60 },
    { label: 'detik', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label} lalu`;
    }
  }
  return 'Baru saja';
}

export default timeAgo;
