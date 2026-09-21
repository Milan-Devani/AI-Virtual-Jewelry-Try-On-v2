/**
 * JEWELAI — AI Jewelry Product Photoshoot Generator Prompts
 * 
 * Implements the full master specification for synthesizing a professional 
 * 4–5 image jewelry photoshoot campaign from a single uploaded jewelry product:
 * - 2–3 lifestyle/model images (different realistic human models wearing the uploaded jewelry)
 * - 2–3 product-only images (exact jewelry from different professional photography angles)
 * - 100% strict jewelry product preservation (stone count, geometry, metal tone, no hallucinations)
 * - Anti-AI constraints (natural skin pores, real lighting, no plastic/cgi look)
 * - Physical grounding mandate (NO floating jewelry in empty space; physical display busts and stone flatlays)
 */

export type PhotoshootDisplayStyle = "marble-flatlay" | "linen-bust" | "studio-pedestal";

export interface PhotoshootPromptOptions {
  category: string;
  theme?: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial";
  displayStyle?: PhotoshootDisplayStyle;
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
 * PHYSICAL GROUNDING MANDATE — PREVENTS "FLOATING IN AIR" AI ARTIFACT
 */
export const PHYSICAL_GROUNDING_MANDATE = `
CRITICAL PHYSICAL GROUNDING MANDATE — NO FLOATING OR LEVITATING JEWELRY:
ABSOLUTELY NO FLOATING JEWELRY IN ZERO-GRAVITY EMPTY AIR.
In real commercial photography, jewelry is NEVER suspended in mid-air without physical support.
Every product photograph MUST depict the jewelry with physical gravity resting on a real, tangible foundation:
1. For Necklaces, Mangalsutras & Pendants:
   * EITHER draped with realistic gravitational weight around a luxury matte linen, ivory velvet, or beige suede jewelry display neck bust / mannequin stand resting solidly on a studio table.
   * OR arranged flat (commercial flatlay) resting directly with natural contact weight upon a solid physical surface: textured beige travertine stone slab, honed Italian Carrara marble, or fine raw silk cloth.
   * FOR 45-DEGREE ANGLE SHOTS: The CAMERA is positioned at an elevated 45-degree angle looking down onto the jewelry that is resting firmly on the surface or display bust. The jewelry ITSELF is physically supported and grounded with gravity. It MUST NOT float, tilt in empty air, or fly like a 3D video game object.
2. For Earrings:
   * Displayed hanging from a minimalist brass or matte black studio jewelry T-stand, or arranged flat on a ceramic jewelry dish / marble block.
3. For Rings:
   * Slotted securely in an ivory velvet ring box / cushion, or resting balanced in a natural stone groove.
4. For Bracelets & Bangles:
   * Resting around a cylindrical linen jewelry bar or arranged flat on a polished stone slab.
5. AMBIENT OCCLUSION & CONTACT SHADOWS:
   * There MUST be crisp, dark contact ambient occlusion shadows directly underneath every bead, chain link, and metal contour where it touches the surface or bust.
`;

/**
 * 8. REALISM REQUIREMENTS & 9. ANTI-AI VISUAL REQUIREMENTS
 */
export const PHOTOGRAPHIC_REALISM_CORE = `
8. REALISM REQUIREMENTS:
Human realism:
* Authentic skin pores, fine facial details, natural skin variation, realistic micro-wrinkles, natural skin sheen
* Natural individual hair strands, realistic eyelashes, realistic eyes with softbox catchlights, natural lips
* Natural hands, correct anatomy, correct fingers (exact count of 5 fingers per hand), realistic nails
* Natural body proportions and posture

Jewelry realism:
* Accurate metal reflections and controlled specular highlights
* Real gravitational contact points: chain pressing subtly into skin and fabric with physical drape
* Correct perspective and natural contact shadows against skin and surfaces
* Realistic gemstone refraction, dispersion, and realistic sparkle (no fake cartoon glow)

Camera realism:
* Shot on high-end medium format Hasselblad or Sony A7R V with prime macro/portrait lenses
* Real optical depth of field with authentic bokeh (not digital post-blur)
* Realistic exposure with natural highlights and controlled softbox shadows
* Professional commercial color grading

9. ANTI-AI VISUAL REQUIREMENTS:
Avoid all common AI-generation artifacts.
DO NOT generate:
* Floating jewelry in mid-air with no support
* Plastic skin or wax-like faces
* Perfectly symmetrical faces or glass eyes
* Extra fingers, missing fingers, deformed hands
* Jewelry fused with skin or floating above chest
* Broken chains, distorted clasps, or warped loops
* Incorrect earrings, extra gemstones, missing gemstones
* Warped jewelry, melting metal, impossible shadows
* Artificial-looking backgrounds or oversaturated colors
* Excessive sharpening, excessive glow, CGI appearance, cartoon appearance, or 3D-render appearance
`;

/**
 * 11. JEWELRY CATEGORY ADAPTATION RULES
 */
function getCategoryGuidance(
  category: string,
  shotType: PhotoshootShotType,
  displayStyle: PhotoshootDisplayStyle = "marble-flatlay"
): string {
  const cat = category.toLowerCase();

  const isBustPreferred = displayStyle === "linen-bust";

  if (cat.includes("earring") || cat.includes("jhumka")) {
    if (shotType === "hero-model") {
      return "Category Focus (Earrings): 3/4 front-side model portrait with head slightly turned, hair elegantly styled behind ear to showcase the earring prominently dangling from the earlobe with natural gravitational hang.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Earrings): Side-profile portrait of a different model, neck and jawline visible, ear and earring prominently visible with natural earlobe contact.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Earrings): Pair of earrings displayed hanging from a minimalist studio brass T-stand on a marble base, OR neatly laid flat on a smooth travertine surface with realistic contact drop shadows.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Earrings): Camera positioned at a 45-degree angle looking down at the earrings resting on a luxury marble jewelry tray, showing the profile thickness, back gallery, stone settings, and drop depth.";
    }
    return "Category Focus (Earrings): Macro detail shot focused directly on the main gemstone cluster, prong setting, and hanging drops resting on the surface.";
  }

  if (cat.includes("necklace") || cat.includes("pendant") || cat.includes("haar") || cat.includes("choker") || cat.includes("mangalsutra")) {
    if (shotType === "hero-model") {
      return "Category Focus (Necklace): 3/4 luxury campaign portrait from chest/collarbone level, necklace resting naturally along the collarbones pressing subtly with physical gravity against skin.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Necklace): Different model looking slightly sideways, close-up framing from shoulder/chest level, necklace clearly visible, clothing neckline perfectly complementary, chain resting with true weight.";
    }
    if (shotType === "product-hero") {
      if (isBustPreferred) {
        return "Category Focus (Necklace): Displayed with physical gravity around a professional luxury matte beige linen jewelry display neck bust / stand resting on a studio wooden table. Symmetrical drape with center pendant highlighted.";
      }
      return "Category Focus (Necklace): Overhead commercial flat-lay photograph arranged symmetrically resting flat upon a honed luxury travertine stone slab with soft contact shadows underneath every bead and pendant.";
    }
    if (shotType === "product-angle") {
      if (isBustPreferred) {
        return "Category Focus (Necklace): Camera angled at 45 degrees three-quarter perspective looking at the necklace draped over the luxury linen neck bust, capturing the dimensional pendant profile, layered gold beads, and back gallery.";
      }
      return "Category Focus (Necklace): Camera angled at an elevated 45-degree three-quarter perspective looking down at the necklace resting flat on a natural Carrara marble slab. The necklace is firmly grounded on the stone surface with dark contact shadows; it does NOT float.";
    }
    return "Category Focus (Necklace): Ultra-macro photograph centered on the main pendant centerpiece, stone cuts, and metal filigree resting on the textured surface.";
  }

  if (cat.includes("bracelet") || cat.includes("bangle") || cat.includes("wristwear") || cat.includes("kada")) {
    if (shotType === "hero-model") {
      return "Category Focus (Bracelet/Bangle): Elegant wrist/hand pose, model wearing the piece with natural wrist posture resting gently against neutral clothing.";
    }
    if (shotType === "alternate-model") {
      return "Category Focus (Bracelet/Bangle): Different model with lifestyle hand gesture, close-up of wrist, graceful fingers with natural nails.";
    }
    if (shotType === "product-hero") {
      return "Category Focus (Bracelet/Bangle): Displayed around a cylindrical beige linen jewelry bar, or lying flat on an ivory travertine display block with natural contact shadows.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Bracelet/Bangle): Camera angled at 45 degrees showing clasp mechanism, hinge, link joints, and lateral stone settings resting on the surface.";
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
      return "Category Focus (Ring): Ring seated upright in a luxury ivory velvet slot cushion or balanced in a natural stone groove with soft drop shadow.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Ring): 45-degree camera angle showing shank profile, crown height, prong basket, and side stone details while seated in its display slot.";
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
      return "Category Focus (Maang Tikka): Flatlay product hero shot resting on ivory silk fabric with chain extended straight above the pendant medallion.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Maang Tikka): 45-degree camera angle looking down at the medallion resting on the fabric showing thickness and hook details.";
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
      return "Category Focus (Payal/Anklet): Curled or linear flat presentation on a luxury velvet or travertine stone display.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Payal/Anklet): 45-degree camera angle showing bells/ghungroos, clasps, and chain links resting on the stone surface.";
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
      return "Category Focus (Haath Phool): Fully displayed flatlay on luxury silk cloth showing the wrist band, connecting chains, and rings.";
    }
    if (shotType === "product-angle") {
      return "Category Focus (Haath Phool): 45-degree camera angle highlighting the central medallion and connecting links resting on the fabric.";
    }
    return "Category Focus (Haath Phool): Macro close-up on the central hand medallion and connecting filigree.";
  }

  // Default general jewelry
  return `Category Focus (${category}): Appropriate commercial framing ensuring the ${category} is the primary visual centerpiece resting with natural physical stability on the display surface.`;
}

/**
 * 10. BACKGROUND DIRECTION & 13. CLOTHING DIRECTION
 */
function getEnvironmentAndClothing(
  shotType: PhotoshootShotType,
  theme: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial" = "luxury-studio",
  displayStyle: PhotoshootDisplayStyle = "marble-flatlay"
): { background: string; clothing: string; physicalSupport: string } {
  const isModelShot = shotType === "hero-model" || shotType === "alternate-model";

  let physicalSupport = "solid honed travertine stone slab with soft contact shadows";
  if (displayStyle === "linen-bust") {
    physicalSupport = "professional luxury matte beige linen jewelry display neck bust standing on a studio wooden table";
  } else if (displayStyle === "studio-pedestal") {
    physicalSupport = "minimal ivory ceramic pedestal and textured linen tray";
  }

  if (theme === "royal-bridal") {
    return {
      physicalSupport,
      background: isModelShot
        ? "Minimal Indian luxury environment, subtle warm amber palatial interior, soft bokeh"
        : `Rich raw silk and polished amber marble surface (${physicalSupport}) with soft directional studio light`,
      clothing: isModelShot
        ? "Traditional Indian bridal styling, elegant saree or lehenga blouse with deep neckline that never overlaps or covers the jewelry"
        : "N/A",
    };
  }

  if (theme === "minimal-white") {
    return {
      physicalSupport,
      background: isModelShot
        ? "Soft high-key ivory studio, minimal clean environment"
        : `Clean pure white studio surface (${physicalSupport}) with soft natural contact drop shadow underneath every element`,
      clothing: isModelShot
        ? "Minimal premium modern fashion styling, solid neutral tone that does not distract from the jewelry"
        : "N/A",
    };
  }

  if (theme === "dark-editorial") {
    return {
      physicalSupport: "dark slate or obsidian stone slab with subtle reflections",
      background: isModelShot
        ? "Dark luxury studio, moody noir background with controlled rim lighting"
        : "Dark luxury studio, matte black obsidian or dark slate surface with specular rim light and dark contact shadows",
      clothing: isModelShot
        ? "Sophisticated dark evening dress, minimal haute couture neckline allowing the jewelry to shine"
        : "N/A",
    };
  }

  // default: luxury-studio
  return {
    physicalSupport,
    background: isModelShot
      ? "Luxury fashion studio, soft beige and warm neutral interior, softboxes, elegant depth of field"
      : `Warm ivory, soft beige, or matte neutral luxury studio surface (${physicalSupport}) with authentic contact shadows`,
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
  const { category, theme = "luxury-studio", displayStyle = "marble-flatlay" } = options;
  const env = getEnvironmentAndClothing(shotType, theme, displayStyle);
  const catGuidance = getCategoryGuidance(category, shotType, displayStyle);

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
* Photorealistic human with natural skin texture, authentic micro-pores, subtle skin warmth, fine facial details, realistic hair strands, and natural body proportions.
* Realistic hands/fingers when visible with correct anatomy.
* PHYSICAL GRAVITY & CONTACT: The uploaded ${category} must physically interact with the model's anatomy with true gravitational weight. Chains and beads must press gently against the skin and collarbones, casting authentic subtle contact shadows and indentations. The jewelry MUST NEVER hover or float above the skin.
* Natural reflections on metal surfaces and realistic gemstone sparkle without artificial glow.
* Professional studio lighting (large softbox key light, gentle hair rim light, soft reflector fill).
* Premium luxury fashion photography with shallow depth of field and high-end DSLR/mirrorless camera look (Hasselblad H6D or Sony A7R V with 85mm f/1.4 lens).
* Composition: 3/4 portrait or close-up framing. Jewelry must be the primary visual focus. Face may be partially visible.
* Background: ${env.background}.
* Clothing: ${env.clothing}. Clothing must NOT overlap or hide the jewelry.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be an authentic, photorealistic commercial luxury campaign photograph. Zero AI plastic look.`,
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
* DIFFERENT model appearance (different facial features, skin tone, and distinct ethnic beauty).
* DIFFERENT hairstyle.
* DIFFERENT pose and body posture.
* DIFFERENT camera angle and framing.
* DIFFERENT clothing/styling.
* DIFFERENT background treatment (${env.background}).

Consistency & Realism Requirements:
* The jewelry must remain EXACTLY the same as the uploaded reference product: exact same stone count, stone shapes, metal color, and proportions.
* PHYSICAL DRAPE: The ${category} rests naturally against the new model's body with true physical gravity and natural skin contact shadows.
* The image should feel like it belongs to the same professional campaign but was photographed during a different studio setup.
* ${catGuidance}
* Clothing: ${env.clothing}. Clothing must NOT overlap or hide the jewelry.

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be an authentic, distinct commercial campaign photograph featuring the same piece.`,
      };

    case "product-hero":
      return {
        title: "Shot 3 — Product Hero Photography",
        description: "Professional product-only jewelry photograph resting on a real physical luxury foundation with macro sharpness.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

${PHYSICAL_GROUNDING_MANDATE}

==============================
SPECIFIC INSTRUCTION: IMAGE 3 — COMMERCIAL PRODUCT HERO PHOTOGRAPHY
==============================
Generate a professional product-only jewelry photograph.
NO human model.
The jewelry should be photographed as a luxury e-commerce product.

Requirements:
* Exact uploaded ${category}.
* PHYSICAL FOUNDATION: The jewelry is physically placed upon: ${env.physicalSupport}.
* Under NO circumstances should the jewelry float or hover in empty space.
* Realistic contact ambient occlusion shadows directly underneath every bead, chain link, and metal contour where it touches the surface/bust.
* Professional studio lighting (Profoto softbox) with soft contact shadow underneath.
* Accurate reflections and realistic metal highlights.
* Realistic gemstone reflections, facets, and refraction.
* Extremely sharp product details across the entire piece (100mm f/8 macro studio lens look).
* DO NOT redesign the jewelry. Maintain 100% fidelity.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be a pristine, commercial-grade product hero photograph with authentic physical contact and grounding.`,
      };

    case "product-angle":
      return {
        title: "Shot 4 — Product 45° Dimensional Angle Photography",
        description: "Three-quarter 45° camera perspective showing depth, metal profile, and stone settings resting on physical support.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

${PHYSICAL_GROUNDING_MANDATE}

==============================
SPECIFIC INSTRUCTION: IMAGE 4 — THREE-QUARTER 45-DEGREE ANGLE SURFACE PHOTOGRAPHY
==============================
Capture a commercial three-quarter perspective photograph where the CAMERA is tilted at an elevated 45-degree angle looking down at the jewelry.
NO human model.

CRITICAL ANTI-LEVITATION & SUPPORT MANDATE:
* The jewelry MUST NOT float, hover, or levitate in mid-air.
* The jewelry MUST physically rest with natural gravity on: ${env.physicalSupport}.
* THE CAMERA IS AT 45 DEGREES, NOT THE JEWELRY FLOATING AT 45 DEGREES. The jewelry remains securely seated on the stone surface or draped over the display bust.
* Real contact shadows: Every bead, chain link, and the main pendant must cast natural contact ambient occlusion shadows on the surface/bust beneath it.
* Show 3D depth, thickness, prong baskets, and metal filigree naturally from this elevated three-quarter viewpoint.
* The jewelry must remain physically accurate and identical to the uploaded reference.
* Background: ${env.background}.
* Controlled studio directional lighting catching dimensional facets and back gallery.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST be a grounded, authentic commercial studio photograph showing dimensional profile with ZERO floating objects.`,
      };

    case "macro-detail":
      return {
        title: "Shot 5 — Detail / Macro Photography",
        description: "Extreme close-up macro photograph focusing on gemstone facets, diamond brilliance, and fine metal craftsmanship.",
        prompt: `${MASTER_PROMPT_CORE}

${JEWELRY_PRESERVATION_CORE}

${PHYSICAL_GROUNDING_MANDATE}

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
* The jewelry is resting securely on: ${env.physicalSupport}.
* Use realistic macro photography (1:1 macro reproduction on a prime 90mm or 100mm f/2.8 Macro lens).
* Use authentic optical shallow depth of field (f/2.8 - f/4).
* The focused jewelry area must be EXTREMELY detailed and razor-sharp, revealing real metal casting grain, prong tightness, and faceted gemstone clarity, while the background naturally falls out of focus into soft, creamy optical bokeh.
* Prismatic gemstone sparkle, realistic caustics, and authentic metal highlights.
* Background: ${env.background}.
* ${catGuidance}

${PHOTOGRAPHIC_REALISM_CORE}

Output MUST look like an authentic luxury jewelry catalog macro photograph with true optical depth.`,
      };
  }
}
