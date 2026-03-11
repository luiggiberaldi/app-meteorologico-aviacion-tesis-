const sharp = require('sharp');

const bg = '#0f172a';
const fg = '#10b981';

const generateIcon = async (size, filename) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="${bg}" />
    <g transform="translate(25, 25) scale(2)" stroke="${fg}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.3c-.2.5.1 1.1.6 1.4l5.5 3 2.7 6.5c.3.5.9.8 1.4.6l3.3-1.2c.5-.2.8-.6.7-1.1z"/>
    </g>
  </svg>`;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(filename);
};

(async () => {
  await generateIcon(192, 'public/icon-192x192.png');
  await generateIcon(512, 'public/icon-512x512.png');
  console.log('Icons generated successfully');
})();
