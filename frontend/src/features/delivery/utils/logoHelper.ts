// Logo Helper - Convert image to base64 for PDF
export const loadLogoAsBase64 = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load logo image'));
    };
    
    // Try to load logo from public folder
    img.src = '/logo-dairy-licious.png';
  });
};

// Fallback: Use inline SVG logo if image fails to load
export const getDairyLiciousLogoSVG = (): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <!-- Dairy Licious Logo - Leaf Design -->
      <circle cx="200" cy="200" r="190" fill="#f0f9f4"/>
      
      <!-- Leaves -->
      <ellipse cx="130" cy="120" rx="30" ry="50" fill="#1e5631" transform="rotate(-30 130 120)"/>
      <ellipse cx="180" cy="90" rx="25" ry="45" fill="#2d7a4f" transform="rotate(-10 180 90)"/>
      <ellipse cx="240" cy="80" rx="28" ry="48" fill="#4caf50" transform="rotate(10 240 80)"/>
      <ellipse cx="290" cy="100" rx="32" ry="52" fill="#66bb6a" transform="rotate(25 290 100)"/>
      <ellipse cx="320" cy="150" rx="35" ry="50" fill="#81c784" transform="rotate(40 320 150)"/>
      
      <!-- Bottom Leaves -->
      <ellipse cx="110" cy="280" rx="30" ry="48" fill="#388e3c" transform="rotate(30 110 280)"/>
      <ellipse cx="170" cy="310" rx="28" ry="45" fill="#4caf50" transform="rotate(10 170 310)"/>
      <ellipse cx="240" cy="320" rx="32" ry="50" fill="#66bb6a" transform="rotate(-10 240 320)"/>
      <ellipse cx="300" cy="300" rx="30" ry="48" fill="#81c784" transform="rotate(-30 300 300)"/>
      
      <!-- Center Circle for Text -->
      <circle cx="200" cy="200" r="110" fill="white"/>
      <circle cx="200" cy="200" r="110" fill="none" stroke="#27ae60" stroke-width="3"/>
      
      <!-- Text -->
      <text x="200" y="190" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#1e5631" text-anchor="middle">
        DAIRY
      </text>
      <text x="200" y="230" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#27ae60" text-anchor="middle">
        LICIOUS
      </text>
    </svg>
  `)}`;
};

const logoHelper = {
  loadLogoAsBase64,
  getDairyLiciousLogoSVG
};

export default logoHelper;
