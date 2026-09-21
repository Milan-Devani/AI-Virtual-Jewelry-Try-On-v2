/**
 * JEWELAI — AI Jewelry Product Photoshoot Generator Prompts
 * 
 * Implements the full master specification for synthesizing a professional 
 * 4–5 image jewelry photoshoot campaign from a single uploaded jewelry product:
 * - 2–3 lifestyle/model images (different realistic human models wearing the uploaded jewelry)
 * - 2–3 product-only images (exact jewelry from different professional photography angles)
 * - 100% strict jewelry product preservation (stone count, geometry, metal tone, no hallucinations)
 * - Anti-AI constraints (natural skin pores, real lighting, no plastic/cgi look)
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

/**
 * 16. FINAL MASTER PROMPT (BASE GENERATION INSTRUCTION)
 * Verbatim master instruction as specified in Section 16.
 */
export const MASTER_PROMPT_CORE = `
Create a professional luxury jewelry photoshoot using the uploaded jewelry product as the absolute visual reference.

Preserve the uploaded jewelry exactly. Maintain its original design, geometry, proportions, gemstones, stone count, stone placement, metal color, craftsmanship, texture and decorative details. Do not redesign, simplify, replace, add or remove any jewelry elements.

Create a realistic commercial photography campaign consisting of 4–5 photographs.

Generate 2–3 photographs featuring realistic professional fashion models naturally wearing the exact uploaded jewelry. Use different models, poses, hairstyles, compositions, camera angles and styling while maintaining complete jewelry consistency.

Generate 2–3 professional product-only photographs showing the exact jewelry from different camera angles, including a hero product photograph, a three-quarter/side angle photograph and a detailed macro photograph.

Every photograph must look as if it was captured by a professional photographer using a high-end DSLR or mirrorless camera with professional jewelry and fashion photography lighting.

Use realistic studio lighting, softboxes, natural highlights, controlled reflections, realistic shadows, realistic depth of field, natural lens characteristics and professional color grading.

Human models must have completely realistic anatomy, skin texture, facial details, hair, hands and fingers.

Jewelry must physically interact naturally with the model's body and clothing. Maintain correct perspective, scale, weight, reflections, shadows and contact points.

Gemstones must have realistic sparkle and refraction. Metal must have physically believable reflections and highlights.

The final images must look like authentic professional photographs from a luxury jewelry photoshoot.

Do not create an AI-art appearance.

Avoid plastic skin, wax faces, artificial eyes, deformed hands, extra fingers, floating jewelry, warped jewelry, incorrect gemstones, missing stones, additional stones, distorted chains, unrealistic reflections, excessive glow, excessive sharpening, CGI appearance, cartoon appearance, 3D-render appearance, unrealistic anatomy or impossible lighting.

The final result should be indistinguishable from a professionally photographed luxury jewelry campaign and suitable for premium e-commerce, advertising and social media.
`;

/**
 * 1. JEWELRY PRODUCT PRESERVATION — CRITICAL RULES
 */
export const JEWELRY_PRESERVATION_CORE = `
1. JEWELRY PRODUCT PRESERVATION — CRITICAL:
The uploaded jewelry is the absolute source of truth.
The AI MUST preserve:
* Exact jewelry design
* Shape & Structure
* Dimensions / proportions
* Exact number of stones
* Stone placement
* Gemstone colors
* Diamond arrangement
* Metal type appearance (yellow gold, silver, rose-gold, platinum, antique finish)
* Gold/silver/rose-gold color accuracy
* Engraving and filigree details
* Chain structure, links and drops
* Pendant structure
* Earring structure, hooks and latkans
* Clasp and findings when visible
* Texture and decorative patterns

DO NOT redesign the jewelry.
DO NOT invent additional stones.
DO NOT remove stones.
DO NOT change the number of stones.
DO NOT change the jewelry pattern.
DO NOT create a similar-looking replacement.
The generated jewelry must visually match the uploaded reference product as closely as possible.
If the uploaded image contains a complex jewelry design, prioritize product fidelity over creative styling.
`;

/**
 * 8. REALISM REQUIREMENTS & 9. ANTI-AI VISUAL REQUIREMENTS
 */
export const PHOTOGRAPHIC_REALISM_CORE = `
8. REALISM REQUIREMENTS:
Human realism:
* Realistic skin pores, fine facial details, natural skin variation
* Natural hair strands, realistic eyelashes, realistic eyes, natural lips
* Natural hands, correct anatomy, correct fingers (exact count of 5 fingers per hand), realistic nails
* Natural body proportions and posture

Jewelry realism:
* Accurate metal reflections and controlled specular highlights
* Correct contact points and physically believable gravitational weight
* Correct perspective and natural contact shadows against skin and clothing
* Realistic gemstone refraction, dispersion, and realistic sparkle (no fake cartoon glow)

Camera realism:
* Natural depth of field and authentic optical bokeh (captured with prime lenses like 85mm f/1.4 or 100mm f/2.8 Macro)
* Realistic lens compression, accurate perspective, subtle lens characteristics
* Realistic exposure with natural highlights and controlled shadows
* Professional commercial color grading

9. ANTI-AI VISUAL REQUIREMENTS:
Avoid all common AI-generation artifacts.
DO NOT generate:
* Plastic skin or wax-like faces
* Perfectly symmetrical faces
* Unrealistic or glass eyes
* Extra fingers, missing fingers, deformed hands
* Floating jewelry or jewelry fused with skin
* Broken chains, distorted clasps, or warped loops
* Incorrect earrings, extra gemstones, missing gemstones
* Warped jewelry, melting metal, impossible shadows
* Artificial-looking backgrounds or oversaturated colors
* Excessive sharpening, excessive glow, CGI appearance, cartoon appearance, or 3D-render appearance
`;

/**
 * 11. JEWELRY CATEGORY ADAPTATION RULES
 */
function getCategoryGuidance(category: string, shotType: PhotoshootShotType): string {
  const cat = category.toLowerCase();

  if (cat.includes("earring") || cat.includes("jhumka")) {
    if (shotType === "hero-model") {
      return "Category Focus (Earrings): 3/4 front-side model portrait with head slightly turned, hair elegantly styled behind ear to showcase the earring prominently dangling from the earlobe.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Earrings): Side-profile portrait of a different model, neck and jawline visible, ear and earring prominently visible with natural earlobe contact.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Earrings): Pair of earrings standing or delicately arranged on luxury studio display, hooks/posts visible, front-facing.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Earrings): 45-degree angled view showing the profile thickness, back gallery, stone settings, and drop depth.";
    }
    return "Category Focus (Earrings): Macro detail shot focused directly on the main gemstone cluster, prong setting, and hanging drops.";
  }

  if (cat.includes("necklace") || cat.includes("pendant") || cat.includes("haar") || cat.includes("choker")) {
    if (shotType === "hero-model") {
      return "Category Focus (Necklace): 3/4 luxury campaign portrait from chest/collarbone level, necklace resting naturally along the collarbones with gravity.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Necklace): Different model looking slightly sideways, close-up framing from shoulder/chest level, necklace clearly visible, clothing neckline perfectly complementary.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Necklace): Symmetrically composed product hero shot on luxury studio surface, clasp and center pendant fully detailed.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Necklace): 45-degree three-quarter view showing pendant depth, chain links thickness, and stone elevation.";
    }
    return "Category Focus (Necklace): Ultra-macro photograph centered on the main pendant centerpiece, stone cuts, and metal filigree.";
  }

  if (cat.includes("bracelet") || cat.includes("bangle") || cat.includes("wristwear") || cat.includes("kada")) {
    if (shotType === "hero-model") {
      return "Category Focus (Bracelet/Bangle): Elegant wrist/hand pose, model wearing the piece with natural wrist posture resting gently against neutral clothing.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Bracelet/Bangle): Different model with lifestyle hand gesture, close-up of wrist, graceful fingers with natural nails.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Bracelet/Bangle): Centered product photograph, circular silhouette upright or resting on luxury display.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Bracelet/Bangle): Three-quarter angle showing clasp mechanism, hinge, link joints, and lateral stone settings.";
    }
    return "Category Focus (Bracelet/Bangle): Macro close-up on the individual links, clasp lock, or stone channel setting.";
  }

  if (cat.includes("ring")) {
    if (shotType === "hero-model") {
      return "Category Focus (Ring): Elegant hand pose near collarbone or cheek, ring worn on finger with natural skin crease and correct proportion.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Ring): Different model's hand resting gracefully on a textured luxury surface, detailed finger composition.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Ring): Solitaire/band upright on a minimal luxury slot or pedestal, front facing with soft drop shadow.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Ring): 45-degree angle showing shank profile, crown height, prong basket, and side stone details.";
    }
    return "Category Focus (Ring): Macro photograph of the main gemstone table, facet symmetry, and prong craftsmanship.";
  }

  if (cat.includes("maang tikka") || cat.includes("matha patti")) {
    if (shotType === "hero-model") {
      return "Category Focus (Maang Tikka): Front/3-quarter bridal portrait, forehead and hair parting clearly visible with tikka resting flat on center forehead.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Maang Tikka): Different model, slight head tilt, regal bridal expression, chain pinned into hair parted naturally.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Maang Tikka): Flatlay product hero shot with chain extended straight above the pendant medallion.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Maang Tikka): 45-degree angle showing the medallion thickness and hook details.";
    }
    return "Category Focus (Maang Tikka): Macro shot on center pendant kundan/polki/gemstone setting and pearl drops.";
  }

  if (cat.includes("payal") || cat.includes("anklet")) {
    if (shotType === "hero-model") {
      return "Category Focus (Payal/Anklet): Elegant lower-leg and ankle composition, anklet resting gracefully above the ankle bone.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Payal/Anklet): Different model pose showing foot and ankle, gentle fabric hemline in background.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Payal/Anklet): Curled or linear presentation on luxury velvet/silk display.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Payal/Anklet): 45-degree side angle showing bells/ghungroos, clasps, and chain links.";
    }
    return "Category Focus (Payal/Anklet): Macro detail of the clasp, chain links, and decorative ghungroo bells.";
  }

  if (cat.includes("haath phool")) {
    if (shotType === "hero-model") {
      return "Category Focus (Haath Phool): Bridal hand pose, wrist bracelet connecting to ring via delicate chains across the back of the hand.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Haath Phool): Different model's hand, side angle showcasing the full chain network and hand center motif.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Haath Phool): Fully displayed product flatlay showing the wrist band, connecting chains, and rings.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Haath Phool): 45-degree angle highlighting the central medallion and connecting links.";
    }
    return "Category Focus (Haath Phool): Macro close-up on the central hand medallion and connecting filigree.";
  }

  // Default general jewelry
  return `Category Focus (${category}): Appropriate commercial framing ensuring the ${category} is the primary visual centerpiece.`;
}

/**
 * 10. BACKGROUND DIRECTION & 13. CLOTHING DIRECTION
 */
function getEnvironmentAndClothing(
  shotType: PhotoshootShotType,
  theme: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial" = "luxury-studio"
): { background: string; clothing: string } {
  const isModelShot = shotType === "hero-model" || shotType === "alternate-model";

  if (theme === "royal-bridal") {
    return {
      background: isModelShot
        ? "Minimal Indian luxury environment, subtle warm amber palatial interior, soft bokeh"
        : "Warm ivory and gold silk surface with soft directional studio light",
      clothing: isModelShot
        ? "Traditional Indian bridal styling, elegant saree or lehenga blouse with deep neckline that never overlaps or covers the jewelry"
        : "N/A",
    };
  }

  if (theme === "minimal-white") {
    return {
      background: isModelShot
        ? "Soft high-key ivory studio, minimal clean environment"
        : "Clean white studio surface with soft natural contact drop shadow",
      clothing: isModelShot
        ? "Minimal premium modern fashion styling, solid neutral tone that does not distract from the jewelry"
        : "N/A",
    };
  }

  if (theme === "dark-editorial") {
    return {
      background: isModelShot
        ? "Dark luxury studio, moody noir background with controlled rim lighting"
        : "Dark luxury studio, matte black obsidian or dark slate surface with specular rim light",
      clothing: isModelShot
        ? "Sophisticated dark evening dress, minimal haute couture neckline allowing the jewelry to shine"
        : "N/A",
    };
  }

  // default: luxury-studio
  return {
    background: isModelShot
      ? "Luxury fashion studio, soft beige and warm neutral interior, softboxes, elegant depth of field"
      : "Warm ivory, soft beige, or matte neutral luxury studio surface with soft shadows",
    clothing: isModelShot
      ? "Elegant luxury styling, minimal high-fashion clothing that complements without covering or hiding the jewelry"
      : "N/A",
  };
}

/**
 * Builds the comprehensive prompt for each of the 5 photoshoot shots
 */
export function buildShotPrompt(
  shotType: PhotoshootShotType,
  options: PhotoshootPromptOptions
): { prompt: string; title: string; description: string } {
  const { category, theme = "luxury-studio" } = options;
  const env = getEnvironmentAndClothing(shotType, theme);
  const catGuidance = getCategoryGuidance(category, shotType);

  switch (shotType) {
    case "hero-model":
      return {
        title: "Shot 1 — Hero Model Shot",
        description: "Professional luxury campaign image featuring a realistic human model wearing the uploaded jewelry naturally.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

==============================
SPECIFIC INSTRUCTION: IMAGE 1 — HERO MODEL SHOT
==============================
Create a professional luxury jewelry campaign image.
A realistic human model wears the uploaded jewelry naturally.

Requirements:
* Photorealistic human with natural skin texture, realistic pores, natural facial features, realistic hair, and natural body proportions.
* Realistic hands/fingers when visible.
* Correct jewelry placement: the uploaded ${category} must physically interact with the model's body/clothing with natural contact points, gravity, and shadows.
* Natural reflections on metal surfaces and realistic gemstone sparkle.
* Professional studio lighting (large softbox, fill light, rim light).
* Premium luxury fashion photography with shallow depth of field and high-end DSLR/mirrorless camera look.
* Composition: 3/4 portrait or close-up framing. Jewelry must be the primary visual focus. Face may be partially visible.
* Background: ${env.background}.
* Clothing: ${env.clothing}. Clothing must NOT overlap or hide the jewelry.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be a photorealistic commercial luxury campaign photograph. Zero AI artifacts.`,
      };

    case "alternate-model":
      return {
        title: "Shot 2 — Different Model / Alternate Angle",
        description: "Different realistic model with distinct pose, hairstyle, and camera angle wearing the exact same jewelry.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

==============================
SPECIFIC INSTRUCTION: IMAGE 2 — DIFFERENT MODEL / DIFFERENT COMPOSITION
==============================
Create another realistic model wearing the EXACT SAME uploaded jewelry.

Use:
* DIFFERENT model appearance (different facial features, skin tone, and ethnic beauty).
* DIFFERENT hairstyle.
* DIFFERENT pose and body posture.
* DIFFERENT camera angle and framing.
* DIFFERENT clothing/styling.
* DIFFERENT background treatment (${env.background}).

Consistency Requirement:
* The jewelry must remain EXACTLY the same as the uploaded reference product.
* Exact same stone count, stone shapes, metal color, and proportions.
* The image should feel like it belongs to the same professional campaign but was photographed during a different setup.
* ${catGuidance}
* Clothing: ${env.clothing}. Clothing must NOT overlap or hide the jewelry.

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be an authentic, distinct commercial campaign photograph featuring the same piece.`,
      };

    case "product-hero":
      return {
        title: "Shot 3 — Product Hero Photography",
        description: "Professional product-only jewelry photograph centered on luxury studio background with macro sharpness.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

==============================
SPECIFIC INSTRUCTION: IMAGE 3 — PRODUCT HERO PHOTOGRAPHY
==============================
Generate a professional product-only jewelry photograph.
NO human model.
The jewelry should be photographed as a luxury e-commerce product.

Requirements:
* Exact uploaded ${category}.
* Background: ${env.background}.
* Professional studio lighting with soft contact shadow underneath.
* Accurate reflections and realistic metal highlights.
* Realistic gemstone reflections, facets, and refraction.
* Extremely sharp product details across the entire piece.
* Macro commercial jewelry photography appearance (100mm f/8 macro studio lens look).
* The product must be centered, upright, and clearly visible.
* DO NOT redesign the jewelry. Maintain 100% fidelity.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be a pristine, commercial-grade product hero photograph suitable for high-end jewelry e-commerce.`,
      };

    case "product-angle":
      return {
        title: "Shot 4 — Product Side / 45° Angle Photography",
        description: "Product-only photograph from a 45-degree angle showing depth, metal profile, and stone settings.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

==============================
SPECIFIC INSTRUCTION: IMAGE 4 — PRODUCT SIDE / ANGLE PHOTOGRAPHY
==============================
Create another product-only photograph of the exact uploaded jewelry from a DIFFERENT angle.
NO human model.

Possible compositions:
* 45-degree angle
* Side angle
* Slight top-down angle
* Three-quarter product view

Requirements:
* Use a distinctly different composition from Shot 3.
* Show 3D depth, thickness, stone settings, and metal details naturally.
* The jewelry must remain physically accurate and identical to the uploaded reference.
* Background: ${env.background}.
* Controlled studio directional lighting catching dimensional facets and back gallery.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be an authentic three-quarter commercial studio product photograph showing structural depth.`,
      };

    case "macro-detail":
      return {
        title: "Shot 5 — Detail / Macro Photography",
        description: "Extreme close-up macro photograph focusing on gemstone facets, diamond brilliance, and fine metal craftsmanship.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

==============================
SPECIFIC INSTRUCTION: IMAGE 5 — DETAIL / MACRO PHOTOGRAPHY
==============================
Create a premium macro detail photograph of the uploaded jewelry.
NO human model.

Focus on:
* Gemstones and diamond facets
* Stone prong settings and diamond arrangement
* Metal craftsmanship, texture, and engraving
* Fine decorative elements, filigree, and clasp when visible

Requirements:
* Use realistic macro photography (1:1 macro reproduction).
* Use authentic shallow depth of field (f/2.8 macro lens).
* The focused jewelry area must be EXTREMELY detailed and razor-sharp while the background naturally falls out of focus into soft, creamy optical bokeh.
* Prismatic gemstone sparkle, realistic caustics, and authentic metal highlights.
* Background: ${env.background}.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST look like an authentic luxury jewelry catalog macro photograph.`,
      };
  }
}
