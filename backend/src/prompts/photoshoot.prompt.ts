/**
 * JEWELAI — AI Jewelry 8-Shot Commercial Campaign & Storyboard Prompts
 * 
 * Implements the user's master specification for generating an 8-image luxury campaign:
 * Image 1 — Product Showcase (Mannequin & Stands)
 * Image 2 — Model Front View (Ivory Saree Portrait)
 * Image 3 — Pendant Macro (Extreme Close-Up on Skin)
 * Image 4 — Earring Side Portrait (70° Profile)
 * Image 5 — Earring Macro (Ultra-Realistic Close-Up)
 * Image 6 — Lifestyle UGC (Spontaneous Personal Interaction)
 * Image 7 — Complete Product Flat Lay (Cream Silk Fabric)
 * Image 8 — Final Hero Portrait (Cinematic Luxury Interior Finale)
 * 
 * Every image is generated and saved as a SEPARATE standalone photograph.
 */

export type PhotoshootDisplayStyle = "marble-flatlay" | "linen-bust" | "studio-pedestal";

export interface PhotoshootPromptOptions {
  category: string;
  theme?: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial";
  displayStyle?: PhotoshootDisplayStyle;
  aspectRatio?: "4:5" | "1:1" | "16:9";
  customInstructions?: string;
}

export type PhotoshootShotType =
  | "product-showcase"
  | "model-front"
  | "pendant-macro"
  | "earring-side"
  | "earring-macro"
  | "lifestyle-ugc"
  | "product-flatlay"
  | "final-hero"
  // Legacy / Storyboard aliases:
  | "storyboard-reveal"
  | "storyboard-touch"
  | "storyboard-macro"
  | "storyboard-profile"
  | "storyboard-climax"
  | "hero-model"
  | "alternate-model"
  | "closeup-model"
  | "couture-model"
  | "editorial-model"
  | "product-hero"
  | "product-angle"
  | "macro-detail";

/**
 * Master instruction — used with every prompt
 */
export const MASTER_INSTRUCTION = `Use the uploaded jewelry product image as the exact product reference. Preserve the jewelry design with maximum fidelity. The jewelry chain, pendant, gemstones, hanging elements, earrings/accents, proportions, patterns, and craftsmanship must remain unchanged. Do not redesign or invent any part of the jewelry.

CRITICAL PRODUCT FIDELITY & ZERO SUBSTITUTION MANDATE:
The uploaded image is the single source of truth for all jewelry pieces.
Every piece depicted — whether a necklace, pendant, mangalsutra chain, or matching earrings — must be replicated with 100% accuracy.
DO NOT substitute, redesign, modernize, or alter any piece.
SPECIFICALLY FOR EARRINGS: When matching earrings are present in the reference image or set, you MUST copy their exact silhouette, upper stud gemstone, central motif plate, colored stones, and specific hanging drop charms. NEVER replace them with generic dome jhumkas, bell-shaped earrings, or different styles.

Photorealistic luxury Indian jewelry photography, realistic human skin and hair, physically accurate gold reflections, natural jewelry physics, warm neutral cinematic lighting, soft depth of field, subtle background bokeh, premium DSLR/cinema-camera photography, realistic textures, natural shadows, elegant Indian aesthetic, high-end jewelry campaign, no CGI appearance, no artificial plastic skin, no text, no logo, no watermark.

CRITICAL STANDALONE SEPARATE IMAGE MANDATE:
Generate THIS INDIVIDUAL PHOTOGRAPH ONLY as ONE single standalone full-frame image.
DO NOT create a collage, montage, storyboard grid, or multi-panel sheet.
DO NOT split the screen or show multiple angles in one image.
The output MUST be a SINGLE, continuous, photorealistic camera capture containing exactly ONE scene.

NEGATIVE:
mismatched earrings, wrong earrings, substituted earrings, invented earrings, generic jhumka, bell-shaped jhumka, dome jhumka when not in reference, wrong jewelry on ears, distorted jewelry, redesigned jewelry, altered jewelry, different jewelry, missing jewelry parts, extra jewelry parts, duplicate jewelry, duplicated gemstones, missing gemstones, extra gemstones, changed proportions, changed colors, melted metal, deformed jewelry, floating jewelry, incorrectly attached jewelry, unnatural jewelry placement, jewelry morphing, deformed hands, extra fingers, missing fingers, bad anatomy, distorted face, plastic skin, wax skin, CGI, 3D render, cartoon, artificial-looking person, excessive beauty filter, unrealistic reflections, blurry product, low detail, text, typography, logo, watermark, collage, storyboard, multiple images, multi-panel, split screen, grid.`;

// Backward-compatible exports
export const MULTI_IMG_MASTER_PROMPT = MASTER_INSTRUCTION;
export const MASTER_PROMPT_CORE = MASTER_INSTRUCTION;
export const JEWELRY_PRESERVATION_CORE = `Preserve the jewelry design with maximum fidelity. The jewelry structure, gemstones, hanging elements, proportions, patterns, and craftsmanship must remain unchanged. Do not redesign or invent any part of the jewelry.`;
export const PHOTOGRAPHIC_REALISM_CORE = `Photorealistic luxury Indian jewelry photography, realistic human skin and hair, physically accurate gold reflections, natural jewelry physics, warm neutral cinematic lighting, soft depth of field.`;
export const PHYSICAL_GROUNDING_MANDATE = `Place the jewelry naturally with true gravitational drape and realistic contact shadows. It MUST NEVER hover or float in mid-air.`;

/**
 * Category adaptation helper to ensure the 8 prompts seamlessly adapt across any category
 */
function getCategoryTerminology(category: string): {
  productName: string;
  elements: string;
  pendantDesc: string;
  earringDesc: string;
  mannequinDesc: string;
} {
  const cat = (category || "").toLowerCase();

  if (cat.includes("mangalsutra")) {
    return {
      productName: "mangalsutra necklace and matching earrings",
      elements: "black-bead mangalsutra chain, gold pendant, gemstones, hanging elements, and matching reference earrings",
      pendantDesc: "pendant and the surrounding black-and-gold bead chains",
      earringDesc: "exact matching gold earring shown on the small stands in the reference image (strictly matching the earring stands, without adding any floral connector or motif from the mangalsutra pendant)",
      mannequinDesc: "elegant dark charcoal jewelry mannequin and matching earring stands",
    };
  }

  if (cat.includes("necklace") || cat.includes("pendant") || cat.includes("haar") || cat.includes("choker")) {
    return {
      productName: "necklace and matching earrings",
      elements: "necklace chain, central pendant, gemstones, filigree drops, and matching reference earrings",
      pendantDesc: "pendant and the surrounding necklace chain / choker structure",
      earringDesc: "exact matching earring shown in the uploaded reference, preserving its identical silhouette, gemstones, and hanging elements (strictly matching the earring from the reference without adding any extra parts from the necklace)",
      mannequinDesc: "elegant dark charcoal jewelry neck mannequin and matching display stands",
    };
  }

  if (cat.includes("earring") || cat.includes("jhumka") || cat.includes("bali") || cat.includes("stud")) {
    return {
      productName: "pair of earrings",
      elements: "earring structure, gemstone clusters, hanging latkans/drops, and ear findings",
      pendantDesc: "main earring gemstone cluster, dome, and hanging pearl/gold drops",
      earringDesc: "matching earring",
      mannequinDesc: "minimalist dark charcoal studio earring display stands",
    };
  }

  if (cat.includes("bangle") || cat.includes("bracelet") || cat.includes("kada") || cat.includes("wristwear")) {
    return {
      productName: "bangle / bracelet",
      elements: "bangle circular structure, gemstones, clasp, hinges, and carved gold patterns",
      pendantDesc: "centerpiece motif, stone setting, and engraved gold links",
      earringDesc: "matching wristwear accent",
      mannequinDesc: "cylindrical dark charcoal luxury velvet jewelry display bar",
    };
  }

  if (cat.includes("ring")) {
    return {
      productName: "luxury ring",
      elements: "ring band shank, crown, center gemstone, prongs, and pave side stones",
      pendantDesc: "ring crown, gemstone facets, and prong craftsmanship",
      earringDesc: "matching ring accent",
      mannequinDesc: "dark charcoal luxury velvet slotted ring display stand",
    };
  }

  if (cat.includes("maang tikka") || cat.includes("matha patti")) {
    return {
      productName: "maang tikka / matha patti",
      elements: "central forehead pendant, pearl drops, kundan/polki setting, and connecting chain",
      pendantDesc: "central forehead medallion and hanging pearl drops",
      earringDesc: "matching hair ornament / earring",
      mannequinDesc: "dark charcoal bridal jewelry display stand",
    };
  }

  if (cat.includes("payal") || cat.includes("anklet")) {
    return {
      productName: "payal / anklet",
      elements: "anklet chain, ghungroo bells, clasp, and decorative accents",
      pendantDesc: "decorative chain links, bells, and centerpiece",
      earringDesc: "matching anklet charm",
      mannequinDesc: "dark charcoal luxury velvet jewelry display riser",
    };
  }

  // Default / Coordinated sets
  return {
    productName: `${category} set`,
    elements: `${category} structure, gemstones, hanging elements, metal luster, and craftsmanship`,
    pendantDesc: `main centerpiece of the ${category}`,
    earringDesc: `matching piece of the ${category}`,
    mannequinDesc: "elegant dark charcoal luxury jewelry display stand",
  };
}

/**
 * Builds the comprehensive prompt for each shot of the 8-shot campaign
 */
export function buildShotPrompt(
  shotType: PhotoshootShotType,
  options: PhotoshootPromptOptions
): { prompt: string; title: string; description: string } {
  const { category = "Mangalsutra", theme = "luxury-studio", aspectRatio = "4:5" } = options;
  const cat = (category || "").toLowerCase();
  const terms = getCategoryTerminology(category);
  const aspectText = `Aspect: ${aspectRatio} vertical`;

  let shotTitle = "";
  let shotDescription = "";
  let promptBody = "";

  switch (shotType) {
    // IMAGE 1 — Product Showcase
    case "product-showcase":
    case "product-hero":
      shotTitle = "Image 1 — Product Showcase";
      shotDescription = "Complete jewelry displayed on an elegant dark charcoal mannequin and stands in a luxury Indian studio.";
      promptBody = `Create a premium jewelry product photograph using the uploaded jewelry image as the exact reference.

Display the complete ${terms.productName} on an ${terms.mannequinDesc}. If the reference image includes matching earrings alongside the necklace, display the matching earrings on small stands directly beside the mannequin, preserving their exact design, gemstones, and hanging charms. The entire jewelry set must be clearly visible from the front.

Place the display in a luxurious Indian jewelry studio with a warm cream and gold background, subtle flowers and softly blurred decorative elements in the background.

Camera positioned straight in front of the product, slightly above the center of the piece. Full product visible from top to bottom.

Soft warm studio lighting, realistic gold reflections, detailed gemstones, crisp jewelry edges, natural shadows, premium jewelry catalog photography.

Product fidelity is the highest priority. Do not alter the jewelry design.

${aspectText}`;
      break;

    // IMAGE 2 — Model Front View
    case "model-front":
    case "hero-model":
    case "storyboard-reveal":
      shotTitle = "Image 2 — Model Front View";
      shotDescription = "Photorealistic luxury Indian jewelry portrait. Elegant Indian woman in an ivory/cream saree with subtle gold embroidery.";
      promptBody = `Create a photorealistic luxury Indian jewelry portrait using the uploaded jewelry image as the exact product reference.

Show an elegant Indian woman wearing the complete set: the exact same ${terms.productName} on her neckline, and the EXACT ${terms.earringDesc} from the reference on her ears. DO NOT generate generic jhumkas or different earrings on her ears; replicate the exact earrings from the reference with identical motifs, colored stones, and hanging elements.

She is dressed in a sophisticated ivory/cream saree with subtle gold embroidery. Natural makeup, subtle bindi, realistic skin texture, naturally styled dark hair in an elegant low bun.

Front-facing medium portrait from approximately waist/chest upward. The complete ${terms.productName} should be clearly visible.

She looks slightly toward the camera with a subtle natural smile. Authentic human expression, natural posture, realistic breathing and body presence.

Warm indoor lighting, soft golden practical lights in the background, shallow depth of field, realistic skin tones, premium Indian jewelry campaign photography.

Keep every piece of jewelry 100% identical to the reference image.

${aspectText}`;
      break;

    // IMAGE 3 — Pendant Macro
    case "pendant-macro":
    case "macro-detail":
    case "closeup-model":
    case "storyboard-macro":
      shotTitle = "Image 3 — Pendant Macro";
      shotDescription = "Extreme photorealistic macro focusing tightly on the centerpiece and intricate craftsmanship resting on natural skin.";
      promptBody = `Create an extreme photorealistic macro jewelry photograph of the exact ${terms.productName} shown in the uploaded reference image.

Focus tightly on the ${terms.pendantDesc} resting naturally against the model's skin. Show the intricate gold craftsmanship, engraved patterns, gemstone details, small hanging elements, and realistic metal texture.

The centerpiece should occupy most of the frame while enough of the surrounding chain / structure remains visible to establish the complete design.

Natural warm skin texture in the background, realistic pores and subtle fabric edge from an ivory saree.

Premium macro jewelry photography, 85mm/100mm macro lens appearance, extremely sharp jewelry details, realistic reflections, soft cinematic background blur, natural warm lighting.

Do not modify, simplify, add, remove, or redesign any jewelry element.

${aspectText}`;
      break;

    // IMAGE 4 — Side & Profile View
    case "earring-side":
    case "alternate-model":
    case "storyboard-profile":
    case "product-angle": {
      const isWristwear = cat.includes("bangle") || cat.includes("bracelet") || cat.includes("kada");
      const isRing = cat.includes("ring");
      const isMaangTikka = cat.includes("maang") || cat.includes("tikka") || cat.includes("matha");

      if (isWristwear) {
        shotTitle = "Image 4 — Side & Wrist Angle View";
        shotDescription = "Graceful 3/4 angle portrait of the model displaying the exact reference bangle/bracelet on her wrist.";
        promptBody = `Create a photorealistic luxury jewelry portrait using the uploaded jewelry image as the exact product reference.
Focus on the model's hand and wrist turned at an elegant 3/4 angle, displaying the EXACT ${terms.productName} from the reference image.
Preserve the exact bangle diameter, carvings, gemstones, and gold finish.
Warm natural lighting, realistic skin texture, soft studio background.
${aspectText}`;
      } else if (isRing) {
        shotTitle = "Image 4 — Hand & Finger Profile View";
        shotDescription = "Elegant side angle portrait highlighting the exact reference ring worn on the model's hand.";
        promptBody = `Create a photorealistic luxury jewelry portrait using the uploaded jewelry image as the exact product reference.
Focus on the model's hand gracefully posed near her collarbone, displaying the EXACT ${terms.productName} on her finger.
Preserve the exact ring shank, crown, center gemstone, and setting from the reference.
Warm natural lighting, realistic skin texture, elegant Indian attire.
${aspectText}`;
      } else if (isMaangTikka) {
        shotTitle = "Image 4 — Hair Parting & Side Profile View";
        shotDescription = "Side-profile portrait showing the exact maang tikka chain along the hair parting.";
        promptBody = `Create a photorealistic side-profile luxury jewelry portrait using the uploaded jewelry image as the exact product reference.
The model's head is turned at a 3/4 angle, clearly showing the EXACT ${terms.productName} connecting chain along her hair parting and forehead.
Preserve the exact pearl drops, gemstones, and gold craftsmanship.
${aspectText}`;
      } else {
        shotTitle = "Image 4 — Earring Side Portrait";
        shotDescription = "Side-profile portrait turned 70° to the side, highlighting the exact reference earring under warm natural window light.";
        promptBody = `Create a photorealistic side-profile luxury jewelry portrait using the uploaded jewelry image as the exact reference.

HERO FOCUS — EXACT REFERENCE EARRING (ZERO MOTIF TRANSFER):
The model's face is turned approximately 70 degrees to the side, placing the visible ear and the earring as the PRIMARY HERO of this photograph.
She is wearing the EXACT matching earring shown in the uploaded reference image.

CRITICAL MANDATE — ZERO MOTIF TRANSFER:
Look ONLY at the earring sitting on its separate small stand at the bottom of the reference photo. Replicate its exact silhouette, dimensions, gemstones, and hanging charms with 100% fidelity.
DO NOT take the floral connector, top flower motif, or any piece from the necklace / mangalsutra pendant and attach it to the earring! The earring has NO extra floral connector above it.
DO NOT substitute with a generic jhumka or alter the design. Both the necklace around her neck and the earring on her ear must remain 100% faithful to their separate appearances in the reference image.

HAIR & STYLING:
Her dark hair is styled in an elegant, neat low chignon bun, cleanly tucked behind her ear so the entire earring is unobstructed, fully visible, and sharply in focus. Natural skin texture, subtle makeup, and realistic ear anatomy.

NECKLINE & ATTIRE:
She wears the same sophisticated ivory and gold saree. The delicate chain of the matching ${terms.productName} rests naturally along her neck and collarbone in the background/secondary plane, while the earring remains the crisp, sharp focal point.

LIGHTING & PHOTOGRAPHY:
Warm natural window light mixed with subtle golden ambient studio lighting. Sharp focus on the earring, crisp gold reflections, authentic gemstone color, and soft cinematic depth of field across the background.

The jewelry must remain 100% identical to the uploaded reference image. Do not invent, alter, or substitute any jewelry piece.

${aspectText}`;
      }
      break;
    }

    // IMAGE 5 — Macro Detail
    case "earring-macro": {
      const isWristwear = cat.includes("bangle") || cat.includes("bracelet") || cat.includes("kada");
      const isRing = cat.includes("ring");
      const isMaangTikka = cat.includes("maang") || cat.includes("tikka") || cat.includes("matha");

      if (isWristwear) {
        shotTitle = "Image 5 — Bangle Macro Close-Up";
        shotDescription = "Ultra-realistic macro close-up of the bangle / bracelet showing intricate gold engravings, gemstones, and clasp.";
        promptBody = `Create an ultra-realistic macro close-up photograph of the EXACT ${terms.productName} from the uploaded jewelry reference image.
Focus tightly on the centerpiece, gold engravings, gemstone settings, and metal polish.
Natural skin texture in the background, sharp jewelry details, physically accurate gold reflections.
Do not modify or alter any part of the jewelry.
${aspectText}`;
      } else if (isRing) {
        shotTitle = "Image 5 — Ring Macro Close-Up";
        shotDescription = "Ultra-realistic macro close-up of the ring crown, center gemstone facets, prongs, and precious metal band.";
        promptBody = `Create an ultra-realistic macro close-up photograph of the EXACT ${terms.productName} from the uploaded jewelry reference image.
Focus tightly on the center gemstone facets, prongs, and precious metal band.
Extreme sharp detail, prismatic gemstone reflections, natural skin texture, luxury jewelry campaign look.
${aspectText}`;
      } else if (isMaangTikka) {
        shotTitle = "Image 5 — Medallion Macro Close-Up";
        shotDescription = "Ultra-realistic macro close-up of the forehead medallion and delicate pearl drops.";
        promptBody = `Create an ultra-realistic macro close-up photograph of the EXACT ${terms.productName} from the uploaded jewelry reference image.
Focus tightly on the central forehead medallion, filigree gold work, gemstones, and pearl drops.
${aspectText}`;
      } else {
        shotTitle = "Image 5 — Earring Macro";
        shotDescription = "Ultra-realistic macro close-up of the earring worn naturally on the ear, showing gold structure and colored stones.";
        promptBody = `Create an ultra-realistic macro close-up photograph of the EXACT matching gold ${terms.earringDesc} from the uploaded jewelry reference image.

The piece is worn naturally on an Indian woman's earlobe. Show the entire piece clearly in sharp macro detail, replicating ONLY the earring as shown on its dedicated stand in the reference photo.
ZERO MOTIF TRANSFER: DO NOT add any floral connector, top flower motif, or extra elements from the necklace / mangalsutra pendant to the earring. The earring in Image 5 must be 100% identical to the reference image and identical to Image 4.

Capture realistic skin texture, individual hair strands gently framing around the ear, natural shadows, and realistic jewelry attachment.

Extremely detailed macro photography, shallow depth of field, luxury jewelry campaign aesthetic, warm neutral lighting, physically accurate gold reflections, premium DSLR macro lens look.

The jewelry must be identical to the reference product with no invented, missing, or altered elements.

${aspectText}`;
      }
      break;
    }

    // IMAGE 6 — Lifestyle UGC
    case "lifestyle-ugc":
    case "storyboard-touch":
      shotTitle = "Image 6 — Lifestyle UGC";
      shotDescription = "Spontaneous, authentic UGC-style luxury photograph of the woman touching and adjusting the jewelry with a natural smile.";
      promptBody = `Create an authentic photorealistic luxury UGC-style photograph of the same Indian woman wearing the exact ${terms.productName} and the EXACT matching reference earrings from the uploaded reference.

She is wearing an elegant ivory and gold saree in a beautiful warm Indian home or luxury boutique environment. She naturally touches and adjusts the jewelry centerpiece with one hand while looking down at the piece with a subtle genuine smile.

EARRING & PRODUCT FIDELITY:
On her ears, she wears the EXACT matching earrings from the reference image, matching the earring stands in the reference photo (without any floral connector from the pendant attached to it, and strictly NOT generic jhumkas). The entire jewelry set must be completely identical to the uploaded reference.

The pose should feel spontaneous and natural, like a real customer/lifestyle jewelry photograph rather than a heavily staged advertisement.

Warm evening ambient light, realistic indoor environment, soft background bokeh, subtle flowers and decorative elements, natural skin texture and realistic hair.

Show the jewelry clearly while maintaining a natural composition.

Premium UGC + cinematic jewelry photography, realistic human proportions, realistic hands and fingers, natural expression.

Exact jewelry preservation across every piece is mandatory.

${aspectText}`;
      break;

    // IMAGE 7 — Complete Product Flat Lay
    case "product-flatlay":
      shotTitle = "Image 7 — Complete Product Flat Lay";
      shotDescription = "Top-down luxury flat-lay on cream silk fabric with delicate white flowers and minimal gold props.";
      promptBody = `Create a premium luxury jewelry flat-lay photograph using the uploaded jewelry image as the exact product reference.

Carefully arrange the complete ${terms.productName} on luxurious cream-colored silk fabric. The piece should be positioned naturally with the centerpiece prominently displayed in the center and the accent pieces placed beside it.

Add subtle elegant Indian luxury props such as small white flowers and a minimal gold decorative object, but keep the jewelry as the clear focus.

Top-down camera angle, beautiful composition, soft folds in the silk, realistic fabric texture, warm natural lighting, realistic gold reflections and gemstones.

High-end Indian jewelry catalog photography, premium editorial styling, photorealistic, extremely detailed.

The jewelry must match the original product exactly. Do not invent or change its design.

${aspectText}`;
      break;

    // IMAGE 8 — Final Hero Portrait
    case "final-hero":
    case "couture-model":
    case "editorial-model":
    case "storyboard-climax":
    default:
      shotTitle = "Image 8 — Final Hero Portrait";
      shotDescription = "Cinematic campaign hero frame. Standing in an elegant warm luxury interior with confident smile and golden bokeh.";
      promptBody = `Create a premium cinematic hero photograph using the uploaded jewelry reference.

Show the same elegant Indian woman wearing the complete ${terms.productName} and the EXACT matching reference earrings. She is dressed in an ivory and gold saree and standing in an elegant warm Indian luxury interior.

Medium portrait composition, beautiful natural posture, subtle confident smile, looking toward the camera. The complete jewelry should be clearly visible: the ${terms.pendantDesc} positioned naturally on her neckline, and the matching earrings visible on her ears (strictly matching the reference earring design without any floral connector from the pendant attached to them, and strictly NOT generic jhumkas).

Warm golden practical lights, soft cream background, subtle floral elements, cinematic bokeh, realistic skin and hair, physically accurate jewelry reflections.

The image should feel like the final hero frame of a premium Indian jewelry campaign while still feeling authentic and realistic.

No text, no typography, no logo, no watermark. Preserve the jewelry exactly as the reference.

${aspectText}`;
      break;
  }

  const prompt = `${MASTER_INSTRUCTION}

==================================================
SPECIFIC INSTRUCTION: ${shotTitle.toUpperCase()}
==================================================

${promptBody}`.trim();

  return {
    prompt,
    title: shotTitle,
    description: shotDescription,
  };
}
