export const transformCloudinaryUrl = (url, { width, quality = 'auto', format = 'auto', crop = 'limit' } = {}) => {
  try {
    if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const prefix = parts[0] + '/upload/';
    const suffix = parts[1];
    const tx = [
      `f_${format}`,
      `q_${quality}`,
      crop && width ? `c_${crop},w_${width}` : (width ? `w_${width}` : ''),
    ].filter(Boolean).join(',');
    return `${prefix}${tx}/${suffix}`;
  } catch {
    return url;
  }
};

export const buildSrcSet = (url, widths = [320, 480, 640, 800, 1024]) => {
  return widths.map(w => `${transformCloudinaryUrl(url, { width: w })} ${w}w`).join(', ');
};
