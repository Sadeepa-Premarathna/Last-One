# How to Add Your Dairy Licious Logo

## Steps:

1. **Save your logo image** (the one with green leaves) as:
   - Filename: `dairy-licious-logo.png`
   - Location: `c:\Inventory Dashboard\frontend\public\dairy-licious-logo.png`

2. **The logo will automatically appear** in:
   - Sidebar (when expanded)
   - Sidebar icon (when collapsed)

## Logo Requirements:
- **Format**: PNG with transparent background (recommended)
- **Size**: At least 400x400px for best quality
- **Aspect Ratio**: Square or slightly wider works best

## Alternative: Use Direct Path
If you have the logo elsewhere, you can:
1. Place it in `public` folder
2. Update the path in `Sidebar.tsx` from `/dairy-licious-logo.png` to your filename

## Current Fallback:
If the logo image is not found, it will show the emoji 🥛 icon as fallback.
