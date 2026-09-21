/**
 * Photoshoot Prompt Builder for JEWELAI Multi-Image Product Photoshoot Generator
 * Generates specialized prompts for each of the 5 commercial photoshoot shots:
 * 1. Hero Model Shot
 * 2. Editorial Alternate Model Shot
 * 3. Product Hero Photography
 * 4. Product 45-Degree Angle Photography
 * 5. Detail / Macro Photography
 */

export interface PhotoshootPromptOptions {
  category: string;
  theme?: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial";
  customInstructions?: string;
}

export type PhotoshootShotType =
  | "hero-model"
  | "alternate-model"
  | "product-hero"
  | "product-angle"
  | "macro-detail";

export const JEWELRY_PRESERVATION_CORE = `
CRITICAL JEWELRY PRODUCT PRESERVATION — ABSOLUTE SOURCE OF TRUTH:
The uploaded reference image is the absolute physical source of truth.
You MUST preserve the jewelry with 100% fidelity:
- Exact jewelry design, outline, geometry, and proportions.
- Exact number of stones and exact stone placement.
- Exact gemstone colors, diamond arrangement, and facet structure.
- Exact metal appearance (22K yellow gold, antique gold, rose gold, silver, or platinum).
- Exact chain structure, links, pendant mounting, earring hooks, clasps, latkans, and filigree.
- Exact craftsmanship texture and fine decorative motifs.

DO NOT redesign the jewelry.
DO NOT invent additional stones.
DO NOT remove stones.
DO NOT change stone count or stone patterns.
DO NOT create a similar-looking replacement.
Prioritize product fidelity over creative styling.
`;

export const PHOTOGRAPHIC_REALISM_CORE = `
REALISTIC PHOTOGRAPHY REQUIREMENTS — ANTI-AI RULES:
- The image must look like it was captured by a professional jewelry photographer using a high-end medium-format Hasselblad or Sony A7R V with prime macro/portrait lenses (85mm f/1.4, 100mm f/2.8 Macro).
- Realistic studio lighting: key softbox, subtle fill light, gentle rim light, controlled specular reflections on metal, natural contact shadows.
- Natural depth of field, authentic optical bokeh, realistic lens exposure.
- ABSOLUTELY NO AI ARTIFACTS: No plastic waxy skin, no airbrushed doll look, no extra or deformed fingers, no floating jewelry, no melting metal, no oversaturated cartoonish colors, no CGI look.
`;

export function buildShotPrompt(
  shotType: PhotoshootShotType,
  options: PhotoshootPromptOptions
): { prompt: string; title: string; description: string } {
  const { category, theme = "luxury-studio" } = options;

  let themeDescription = "clean luxury editorial studio setting with warm ivory and subtle neutral gradient";
  if (theme === "royal-bridal") {
    themeDescription = "opulent Indian royal bridal aesthetic, rich raw silk textures, subtle warm golden ambient glow";
  } else if (theme === "minimal-white") {
    themeDescription = "pure high-key minimalist commercial white e-commerce studio background with soft realistic drop shadows";
  } else if (theme === "dark-editorial") {
    themeDescription = "dramatic dark onyx luxury editorial studio with focused spotlighting catching gold and gemstone luster";
  }

  switch (shotType) {
    case "hero-model":
      return {
        title: "Hero Model Campaign",
        description: "Professional luxury campaign shot of a realistic model wearing the jewelry with studio lighting",
        prompt: `Create a professional luxury jewelry campaign photograph featuring a real, photorealistic human fashion model wearing the exact uploaded jewelry product.

${JEWELRY_PRESERVATION_CORE}

SHOT 1 SPECIFICS — HERO MODEL CAMPAIGN:
- A realistic human model naturally wears the uploaded ${category}.
- Composition: 3/4 portrait or close-up framing, with the ${category} as the primary focal point of the composition.
- Natural human skin texture with microscopic pores, subcutaneous warmth, genuine eye reflections, and individual fine hair strands.
- Jewelry must physically interact with the model's anatomy with true gravitational realism, casting natural contact shadows on skin and fabric.
- Elegant luxury styling with complementary neckline/clothing that showcases the jewelry cleanly without covering it.
- Environment: ${themeDescription}.
${PHOTOGRAPHIC_REALISM_CORE}
Output MUST be an authentic commercial jewelry campaign photograph.`,
      };

    case "alternate-model":
      return {
        title: "Editorial Model Angle",
        description: "Distinct realistic model with alternate pose and camera angle showcasing the jewelry's versatility",
        prompt: `Create a second commercial jewelry photograph showing a DIFFERENT realistic model wearing the exact same uploaded jewelry product.

${JEWELRY_PRESERVATION_CORE}

SHOT 2 SPECIFICS — ALTERNATE MODEL & COMPOSITION:
- Feature a DIFFERENT realistic fashion model from Shot 1 (different facial features, different hairstyle, different subtle pose and camera angle).
- The jewelry product must remain 100% identical in every detail to the uploaded reference.
- Dynamic editorial composition:
  * If necklace: subtle profile or chin-tilt looking towards soft studio light, collarbone alignment.
  * If earrings/jhumkas: elegant side-profile angle highlighting the drop, latkans, and earlobe seating.
  * If bracelet/bangles: graceful hand/wrist gesture resting against luxury textured fabric.
  * If ring: delicate hand pose with focus on knuckle and stone setting.
  * If bridal/set: three-quarter regal expression with hair softly pinned back.
- Environment: ${themeDescription}.
${PHOTOGRAPHIC_REALISM_CORE}
Output MUST look like a distinct second photograph from the same luxury campaign shoot.`,
      };

    case "product-hero":
      return {
        title: "Product Hero E-Commerce",
        description: "Clean product-only photograph on luxury studio surface with soft shadows and sharp reflections",
        prompt: `Create a master-grade professional product-only jewelry photograph of the uploaded product. NO human model.

${JEWELRY_PRESERVATION_CORE}

SHOT 3 SPECIFICS — PRODUCT HERO PHOTOGRAPHY:
- Pure product-only photograph of the exact uploaded ${category}.
- The jewelry is gracefully displayed centered on a premium surface: ${themeDescription}.
- Extremely sharp, crisp focus across the entire piece.
- Soft realistic contact shadows underneath, physically accurate metallic highlights, and genuine gemstone sparkles.
- Macro commercial product photography aesthetic (100mm f/8 macro studio lens look).
${PHOTOGRAPHIC_REALISM_CORE}
Output MUST be a clean, crisp, premium e-commerce hero photograph suitable for a luxury jewelry catalog.`,
      };

    case "product-angle":
      return {
        title: "45° Dimensional Profile",
        description: "Three-quarter side angle showing depth, thickness, metal craftsmanship, and stone prongs",
        prompt: `Create a professional product-only photograph showing the exact uploaded jewelry from an alternate 45-degree dimensional angle. NO human model.

${JEWELRY_PRESERVATION_CORE}

SHOT 4 SPECIFICS — 45-DEGREE ANGLE & DEPTH:
- Photographed from an elevated 45-degree or three-quarter side angle to display the 3D depth, metal thickness, profile contours, stone settings, and craftsmanship of the ${category}.
- Displays the structural artistry: back gallery, prongs, clasps, or layered geometry.
- Displayed on a clean luxury pedestal matching: ${themeDescription}.
- Controlled directional studio lighting that accentuates the dimensional contours without blowout or flat shadows.
${PHOTOGRAPHIC_REALISM_CORE}
Output MUST clearly showcase the three-dimensional depth and craftsmanship of the jewelry piece.`,
      };

    case "macro-detail":
      return {
        title: "Gemstone & Craftsmanship Macro",
        description: "Extreme close-up macro focusing on gemstone facets, diamond brilliance, and fine filigree",
        prompt: `Create an extreme close-up macro photograph focusing intimately on the fine details and gemstone craftsmanship of the uploaded jewelry. NO human model.

${JEWELRY_PRESERVATION_CORE}

SHOT 5 SPECIFICS — MACRO GEMSTONE & CRAFTSMANSHIP:
- Extreme macro close-up (1:1 magnification) centered on the most intricate focal point of the ${category}: gemstone facets, diamond clarity, stone prong settings, filigree, engraving, or gold luster.
- Artistic shallow depth of field (f/2.8 macro): the focused gemstone facets and metal textures are razor-sharp with microscopic detail, while the background and foreground fall away into soft, creamy, luxurious bokeh.
- Prismatic light refraction, diamond fire, and realistic metallic micro-reflections.
- Environment: ${themeDescription}.
${PHOTOGRAPHIC_REALISM_CORE}
Output MUST look like an authentic luxury jewelry magazine macro photograph.`,
      };
  }
}
