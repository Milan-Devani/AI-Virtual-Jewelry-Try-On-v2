export const PHOTOGRAPHY_STYLES: Record<string, string> = {
  studio: `
- Photography Style: High-End Commercial Jewelry Studio
- Lighting: Multi-point diffused softbox lighting with rim highlights accentuating the metallic luster of the jewelry and radiant skin texture.
- Camera: Shot on 85mm f/1.8 prime lens, crisp focus on the jewelry, subtle natural optical depth-of-field.
- Color Grading: Clean neutral white balance with accurate metallic reflections (gold, rose gold, silver, platinum).
`.trim(),

  luxury: `
- Photography Style: Luxury Indian Heritage Campaign & Editorial
- Lighting: Warm cinematic lighting with golden ambient fill and subtle spotlighting on diamonds, polki, and gemstones to produce natural brilliance.
- Camera: Shot on 105mm macro lens, high dynamic range, tack-sharp gemstone facets.
- Color Grading: Warm opulent tones, rich saturation in silks and regal jewelry metals.
`.trim(),

  minimal: `
- Photography Style: Contemporary Minimalist Editorial
- Lighting: Soft architectural daylighting with soft diffused natural shadows.
- Camera: 50mm f/2.8 lens, modern, clean, uncluttered Vogue/Harper's Bazaar aesthetic.
- Color Grading: Muted neutral tones, true-to-life skin highlights, and razor-sharp jewelry edges.
`.trim(),

  outdoor: `
- Photography Style: Golden Hour Natural Light Editorial
- Lighting: Warm low-angle natural sunset lighting with gentle lens glow and organic highlights on gold and gemstones.
- Camera: 85mm f/1.4 lens with creamy bokeh in the background.
- Color Grading: Warm sun-kissed palette, radiant glowing skin tones.
`.trim(),
};

export function getPhotographyStyle(style?: string): string {
  if (!style) return PHOTOGRAPHY_STYLES.studio;
  return PHOTOGRAPHY_STYLES[style.toLowerCase()] || PHOTOGRAPHY_STYLES.studio;
}
