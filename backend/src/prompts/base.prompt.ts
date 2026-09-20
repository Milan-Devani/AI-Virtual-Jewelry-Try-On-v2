export const BASE_SYSTEM_PROMPT = `You are creating a premium, master-quality photorealistic Indian jewelry commercial photograph.

REFERENCE IMAGE 1:
The human model.

REFERENCE IMAGE 2:
The exact jewelry product.

The final output MUST be an authentic commercial studio photograph showing the SAME REAL HUMAN MODEL from Reference Image 1 wearing the EXACT JEWELRY PRODUCT from Reference Image 2.

CRITICAL PRE-EXISTING JEWELRY REPLACEMENT & INPAINTING (ZERO MERGING):
- AUTOMATIC DETECTION & COMPLETE REMOVAL: If the human model in Reference Image 1 is already wearing ANY existing jewelry in the target placement area (such as an existing necklace, mangalsutra, chain, choker, earrings, studs, hoops, jhumkas, bracelets, bangles, or maang tikka):
  * YOU MUST COMPLETELY REMOVE, ERASE, AND REPLACE that existing jewelry with the new jewelry product from Reference Image 2.
  * ABSOLUTELY NEVER MERGE, OVERLAY, OR DOUBLE-WEAR: Do not combine old and new necklaces together. Do not leave the old earrings underneath or blended with the new earrings. Do not generate double chains, duplicate pendants, or cluttered overlapping jewelry.
  * CLEAN ANATOMICAL SKIN INPAINTING: Seamlessly inpaint and restore bare, flawless, natural human skin where the old jewelry was removed (neck, décolletage, collarbones, earlobes, wrists, forehead). The underlying skin must have authentic continuous skin pores, natural dermal micro-texture, and zero ghost artifacts or leftover jewelry fragments.
  * DRESS EXCLUSIVELY IN REFERENCE IMAGE 2: The model must wear ONLY the new product jewelry from Reference Image 2 in that category.
  * UNRELATED ACCESSORIES: Non-competing accessories in different body areas (e.g. nose stud, bindi, or outfit borders) should remain undisturbed.

CRITICAL PHOTOREALISM — LUXURY COMMERCIAL STUDIO PHOTOSHOOT FEEL:
- AUTHENTIC HUMAN REALISM: Must look like a real, high-end editorial commercial studio photograph captured of a real person. ABSOLUTELY NO plastic skin, NO airbrushed waxy smoothing, NO CGI doll look, NO fake digital filters.
- SKIN TEXTURE: Natural microscopic skin pores, subtle epidermal micro-texture, authentic subsurface scattering, and natural warmth. NO plastic skin, NO airbrushed doll look, NO artificial CGI waxiness, NO over-smoothed face filters.
- EYES & EXPRESSION: Natural corneal reflections, crisp catchlights from studio softboxes, realistic wetness and depth in the eyes, individual eyelash and brow definition.
- PHYSICAL WEIGHT, GRAVITY & CONTACT: The new jewelry must physically rest against the model's anatomy with true gravitational realism:
  * Necklaces / Mangalsutras follow the natural 3D contours of the neck and collarbones, settling with realistic physical contact shadows.
  * Earrings / Jhumkas hang with authentic physical weight from the earlobe, casting delicate micro-shadows on the neck and jawline.
  * Bangles / Kadas encircle the wrist naturally without hovering or clipping.
- LIGHTING & CONTACT: Physically accurate contact shadows where the jewelry touches the skin/neck/ears/wrists, true-to-life reflections, bounce light, and authentic ambient occlusion.
- CAMERA & OPTICS: Captured with an 85mm f/1.4 luxury fashion portrait lens (Hasselblad / Leica medium format aesthetic), crisp focus on the jewelry and facial features with gentle optical depth of field, ray-traced metallic reflections on gold, silver, and gemstones.

MODEL IDENTITY PRESERVATION IS CRITICAL:
Preserve the model's exact identity and facial structure from Reference Image 1:
- exact facial bones, jawline, nose bridge, lips, eyes, eyebrows
- skin undertone and complexion
- natural hair structure and hairline
- body proportions and pose
Do not replace or alter the person.
Do not create duplicate or distorted limbs, hands, or ears.

JEWELRY PRODUCT FIDELITY IS CRITICAL:
Reference Image 2 represents the exact manufactured jewelry product being sold.
Preserve with 100% fidelity:
- jewelry design, metal color (e.g. 22K yellow gold, antique gold, rose gold, 925 sterling silver, platinum)
- gemstone arrangement, stone facets, diamond clarity, emeralds, rubies, pearls, and kundan
- pendant geometry, chain weave, latkans, filigree, and intricate craftsmanship
- exact proportions and physical weight
Do not redesign, simplify, or hallucinate different jewelry.

PLACEMENT:
{{CATEGORY_PLACEMENT}}

ENVIRONMENT & BACKGROUND:
{{BACKGROUND_SETTING}}

Return ONLY the finished, master-grade photograph of the model wearing the jewelry.`;

export const BASE_AI_MODEL_SYSTEM_PROMPT = `You are creating a world-class luxury jewelry e-commerce campaign photograph featuring a real-looking human model wearing the provided jewelry product.

REFERENCE IMAGE:
The exact jewelry product being showcased.

CRITICAL PHOTOREALISM — MUST LOOK LIKE A REAL HUMAN PHOTOGRAPH, NEVER AI-GENERATED:
- NATURAL HUMAN SKIN: Realistic human skin with visible microscopic pores, natural tone variations, realistic subsurface scattering, delicate highlights on cheekbones, and lifelike skin translucency. ABSOLUTELY NO plastic, waxy, CGI, or over-airbrushed skin.
- REALISTIC EYES & ANATOMY: Authentic iris patterns, soft catchlights, moisture reflections, and lifelike natural gaze. Anatomically perfect hands, fingers, neckline, and ears.
- FABRIC & TEXTILES: Authentic physical textile textures (e.g. pure raw Kanjeevaram silk weave, zari metallic gold threads, Bandhani tie-dye texture, velvet nap) with realistic drape and folds.
- OPTICS & LIGHTING: Shot on medium-format commercial camera (85mm portrait lens), soft directional studio key lights, and physical contact shadows beneath every stone and chain link.

JEWELRY PRODUCT FIDELITY IS CRITICAL:
The provided image represents the exact real product being sold.
Preserve:
- jewelry design, gemstones, stone cuts, and metal luster
- pendant shape, chain weave, latkans, and ornamental details
- exact proportions, craftsmanship, and recognizable silhouette
Do not redesign or alter the jewelry. The jewelry must match the reference image with 100% fidelity.

MODEL PERSONA SPECIFICATIONS:
{{MODEL_PERSONA}}

PLACEMENT & WEARING INSTRUCTIONS:
{{CATEGORY_PLACEMENT}}

ENVIRONMENT & LIGHTING:
{{BACKGROUND_SETTING}}

Return ONLY the single finished, master-grade commercial photograph. Do not show the product separately or create a collage.`;
