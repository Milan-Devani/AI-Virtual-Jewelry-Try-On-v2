/**
 * JEWELAI — Photorealistic Luxury Jewelry Fashion Campaign Video Prompts
 *
 * Implements the master video specification for AI motion / video try-on generation:
 * - 100% exact reference product preservation (stones, metal, shape, geometry)
 * - 15–20 second commercial runway / editorial video campaign
 * - 5-stage human model performance (medium shot -> tracking push-in -> macro shot -> angle change -> 2-3s hero close-up)
 * - Category-specific camera focus directives (earrings, necklaces, bracelets, jhumkas, payal, maang tikka, haath phool, rings)
 * - Cinematic camera direction & soft luxury studio lighting
 * - Premium minimal luxury studio environment
 * - Strict negative prompt eliminating CGI/plastic/warping artifacts
 */

export interface BuildVideoPromptOptions {
  category?: string;
  motionStyle?: "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose" | "ugc-cinematic" | string;
  customPrompt?: string;
  durationSeconds?: number;
}

/**
 * Verbatim Master Video Prompt Specification
 */
export const MASTER_VIDEO_PROMPT_CORE = `Create a photorealistic luxury jewelry fashion campaign video using the uploaded jewelry product image as the **exact reference product**.

The uploaded jewelry must be worn by a realistic human fashion model. Preserve the jewelry's exact design, shape, proportions, gemstone placement, metal color, texture, engraving, stones, setting, and overall appearance. **Do not redesign, simplify, replace, duplicate, or invent any part of the jewelry.**

### VIDEO REQUIREMENTS

* Duration: 15–20 seconds
* Style: luxury jewelry commercial / premium fashion photoshoot
* Photorealistic live-action appearance
* Natural human movement
* Realistic skin texture and natural facial details
* Realistic hair movement
* Natural body proportions
* Cinematic but believable camera movement
* Soft natural studio lighting
* Realistic shadows and reflections
* Premium jewelry-store/editorial aesthetic
* No artificial-looking CGI appearance
* No cartoon, plastic, overly smooth, or synthetic skin
* No unrealistic glow around the jewelry
* No excessive visual effects

### MODEL PERFORMANCE

Start with the model standing naturally in an elegant luxury fashion environment.

The model slowly walks toward the camera with confident but natural movement.

During the walk:

1. Show a beautiful full/medium fashion shot of the model wearing the jewelry.
2. Slowly move the camera closer to the jewelry.
3. Capture a detailed macro/micro product shot.
4. Show the jewelry from a slightly different angle while the model naturally moves.
5. Finish with a premium close-up hero shot of the jewelry.

The model's movements should feel like a real professional jewelry photoshoot rather than an AI-generated animation.

Use subtle natural movements:

* natural walking
* gentle head movement
* realistic blinking
* subtle facial expression
* natural hand movement
* realistic fabric movement
* slight hair movement
* natural breathing and body motion

Avoid exaggerated posing or unnatural movements.

### JEWELRY FOCUS

The jewelry is the hero of the video.

Keep the uploaded jewelry clearly visible and physically attached to the correct body location.

For earrings:
* show a side/profile angle
* allow the earrings to move naturally with the model
* include a macro close-up showing stones and metal details

For necklaces and pendants:
* show the necklace sitting naturally on the neck/chest
* camera slowly moves toward the pendant
* include a close-up showing chain, pendant, stones, and craftsmanship

For bracelets and wristwear:
* naturally position the bracelet on the wrist
* include a hand/arm movement
* capture a macro shot of the bracelet from multiple angles

For jhumkas:
* show the model's face and ear from a 3/4 angle
* allow the jhumka to move naturally
* capture a close-up showing the bell shape, hanging elements, stones, and details

For payal/anklets:
* show the model walking naturally
* briefly focus the camera toward the ankle
* capture the payal moving naturally with each step
* include a detailed close-up

For maang tikka:
* show the model from the front and slightly above eye level
* keep the maang tikka centered naturally on the forehead
* include a close-up showing its pendant, chain, and stones

For haath phool:
* show natural hand movement
* clearly show the connection between bracelet, fingers, and decorative elements
* include a detailed macro shot of the hand jewelry

### CAMERA DIRECTION

Use realistic professional camera movement:

Opening:
Medium/full-body fashion shot.

Middle:
Smooth tracking shot following the walking model.

Product reveal:
Slow cinematic push-in toward the jewelry.

Macro:
Extreme close-up / jewelry product shot with shallow depth of field.

Final:
Elegant hero shot where the model and jewelry are both clearly visible.

Use realistic lens behavior, natural depth of field, subtle focus transitions, and physically believable camera motion.

### LIGHTING

Use soft, natural luxury-fashion lighting.

Lighting should look like a real professional jewelry photoshoot:

* soft key light
* subtle fill light
* realistic highlights on metal
* controlled reflections on gemstones
* natural shadows
* realistic skin illumination
* soft background separation

Do not use neon lighting, excessive bloom, artificial glow, or dramatic CGI lighting.

### ENVIRONMENT

Create a premium minimal luxury fashion environment.

The background should be elegant and slightly blurred so the jewelry remains the main focus.

Use subtle neutral luxury tones, premium architectural/interior details, or an elegant fashion studio.

The environment must look physically real and photographed with a professional camera.

### PRODUCT FIDELITY — CRITICAL

The uploaded jewelry reference is the source of truth.

Preserve:

* exact jewelry design
* exact shape
* exact size relationship
* exact gemstone count
* exact gemstone arrangement
* exact metal color
* exact texture
* exact decorative elements
* exact proportions
* exact product identity

Never change the jewelry between shots.

Do not add extra stones.
Do not remove stones.
Do not create additional jewelry.
Do not merge different jewelry designs.
Do not distort the product.
Do not change gold/silver/rose-gold appearance.
Do not alter the product's structure.

### REALISM

The final result should look like it was filmed by a professional fashion photographer using a real camera.

It should feel like a real luxury jewelry advertisement, not an AI-generated video.

Prioritize:
photorealism + natural movement + product accuracy + realistic lighting + realistic materials + realistic camera motion.

### FINAL SHOT

End with a premium 2–3 second hero shot.

The model remains naturally posed while the camera slowly moves closer to the jewelry.

The jewelry should be sharply detailed with realistic gemstone reflections and metal highlights.

The final frame should look suitable for a luxury jewelry e-commerce website, Instagram Reel, product advertisement, or fashion campaign.`;

/**
 * Verbatim Negative Prompt Specification
 */
export const VIDEO_NEGATIVE_PROMPT =
  "AI-looking faces, plastic skin, wax skin, distorted hands, extra fingers, missing fingers, deformed body, unnatural walking, floating jewelry, detached jewelry, duplicated jewelry, changing jewelry design, incorrect jewelry placement, melted gemstones, distorted metal, fake reflections, excessive glow, CGI appearance, cartoon style, animation style, unrealistic camera movement, flickering, frame-to-frame product changes, inconsistent face, inconsistent clothing, inconsistent body proportions, unstable background, excessive motion blur, oversaturated colors, artificial lighting, low-detail jewelry, blurry product, warped jewelry, duplicated accessories, extra accessories, mismatched earrings, wrong earrings, generic jhumka, substituted jewelry";

/**
 * Verbatim Master UGC Cinematic Video Prompt Specification (7-Scene Storyboard)
 */
export const UGC_CINEMATIC_MASTER_PROMPT_CORE = `Reference image: Use the uploaded mangalsutra jewelry image/storyboard as the exact product reference.

Create a photorealistic premium UGC-style cinematic jewelry advertisement, 15–20 seconds long, featuring the exact Direct Gold Plated Mangalsutra No.132 MK shown in the reference image.

CRITICAL PRODUCT PRESERVATION: The mangalsutra, pendant, black beads, gold detailing, gemstones, earrings, proportions, pattern, and craftsmanship must remain identical to the reference product in every shot. Do not redesign, simplify, add, remove, or morph any jewelry elements.

Scene 1 — Product Introduction | 0–2.5s
Start with the complete jewelry set on a dark elegant jewelry mannequin/display stand. Slow cinematic camera push-in. Show the full mangalsutra and matching earrings. Warm natural golden lighting, realistic reflections on gold, shallow depth of field, luxury Indian jewelry showroom atmosphere.

Scene 2 — Model Wearing Jewelry | 2.5–5.5s
Cut naturally to a beautiful Indian woman wearing the exact same mangalsutra and matching earrings. Elegant cream/gold saree, natural makeup, subtle bindi, realistic skin texture. Medium front shot. She gently turns toward the camera and gives a natural subtle smile.

Scene 3 — Pendant Macro Shot | 5.5–8s
Cinematic macro camera movement toward the pendant. Show the intricate gold craftsmanship, black-bead chain, colored gemstones and hanging elements. Realistic gold reflections and tiny natural movements. Camera slowly moves from the chain toward the pendant.

Scene 4 — Side / Earring Shot | 8–10.5s
Model turns her face naturally to a 3/4 side angle. Focus on the matching earring. Hair moves slightly naturally. Camera performs a smooth slow orbit. Capture realistic gold shine and detailed earring craftsmanship.

Scene 5 — Lifestyle UGC Moment | 10.5–13.5s
Model naturally adjusts the mangalsutra with her fingers and looks down at it, then looks back toward the camera. Make the moment feel like an authentic luxury UGC jewelry recommendation rather than a traditional commercial. Natural body movement, realistic facial expression and eye movement.

Scene 6 — Full Jewelry Beauty Shot | 13.5–16.5s
Medium-to-full portrait of the model wearing the complete jewelry set. She slowly walks forward or turns naturally while the camera tracks backward. Cream/gold Indian festive environment, warm practical lights, subtle background bokeh.

Scene 7 — Final Hero Shot | 16.5–20s
End with a beautiful close-to-medium portrait of the model wearing the complete set. Slow camera push-in toward the pendant and face. Finish with a clean luxury composition.

Visual style: photorealistic, premium Indian jewelry campaign, authentic UGC feeling, cinematic but natural, realistic human skin, realistic hair, physically accurate gold reflections, natural jewelry movement, warm neutral lighting, soft shadows, shallow depth of field, 4K detail, high-end DSLR/cinema camera look.

Camera: 35mm and 85mm cinematic lenses, slow dolly movements, subtle handheld micro-movement where appropriate, smooth tracking, macro focus pulls, realistic depth of field.

Lighting: soft natural window light mixed with warm practical lights, no artificial plastic-looking highlights, realistic gold reflections.

Motion: natural human movement, natural blinking, subtle breathing, realistic hand movement, realistic jewelry physics. No frozen face, no unnatural body movement.

Overall feeling: authentic Indian woman wearing beautiful jewelry in real life, elegant, aspirational, premium, trustworthy, not obviously AI-generated.`;

/**
 * Dedicated Verbatim UGC Cinematic Video Negative Prompt
 */
export const UGC_CINEMATIC_NEGATIVE_PROMPT =
  "distorted jewelry, changed jewelry design, different pendant, missing gemstones, extra gemstones, incorrect black beads, melted gold, duplicate earrings, asymmetrical jewelry, floating jewelry, jewelry morphing, deformed hands, extra fingers, bad anatomy, plastic skin, wax face, artificial smile, frozen expression, unnatural walking, excessive beauty filter, CGI appearance, cartoon, oversaturated gold, unrealistic reflections, flickering, frame-to-frame product changes, face changing, identity changing, blurry jewelry, low resolution, text, watermark, logo, duplicate person";

/**
 * Returns category-specific jewelry focus and camera choreography directives
 */
export function getVideoJewelryFocusDirective(category = "jewelry"): string {
  const norm = category.toLowerCase().trim();

  if (norm.includes("jhumka")) {
    return "JEWELRY FOCUS (Jhumkas): Show the model's face and ear from a 3/4 angle. Allow the jhumka to move naturally with subtle head movement. Capture a close-up showing the bell shape, hanging latkan elements, stones, and intricate filigree details.";
  }
  if (
    norm.includes("earring") ||
    norm.includes("stud") ||
    norm.includes("hoop") ||
    norm.includes("chandbali")
  ) {
    return "JEWELRY FOCUS (Earrings): Show a side and profile angle. Allow the earrings to move naturally with the model. Include a macro close-up showing stones, prongs, and polished metal craftsmanship.";
  }
  if (
    norm.includes("necklace") ||
    norm.includes("pendant") ||
    norm.includes("choker") ||
    norm.includes("mangalsutra") ||
    norm.includes("chain") ||
    norm.includes("haar") ||
    norm.includes("mala")
  ) {
    return "JEWELRY FOCUS (Necklaces and Pendants): Show the necklace sitting naturally on the neck and chest collarbone. Camera slowly moves toward the pendant. Include a close-up showing chain links, pendant, stones, and fine craftsmanship.";
  }
  if (
    norm.includes("bracelet") ||
    norm.includes("bangle") ||
    norm.includes("wrist") ||
    norm.includes("kada") ||
    norm.includes("cuff")
  ) {
    return "JEWELRY FOCUS (Bracelets and Wristwear): Naturally position the bracelet on the model's wrist. Include natural hand and arm movement. Capture a macro shot of the bracelet from multiple angles.";
  }
  if (norm.includes("payal") || norm.includes("anklet")) {
    return "JEWELRY FOCUS (Payal/Anklets): Show the model walking naturally. Briefly focus the camera toward the ankle. Capture the payal moving naturally with each step. Include a detailed close-up showing links, bells, and delicate charms.";
  }
  if (
    norm.includes("maang") ||
    norm.includes("tikka") ||
    norm.includes("matha") ||
    norm.includes("borla") ||
    norm.includes("forehead")
  ) {
    return "JEWELRY FOCUS (Maang Tikka): Show the model from the front and slightly above eye level. Keep the maang tikka centered naturally on the forehead along the hair parting. Include a close-up showing its pendant, chain, and stones.";
  }
  if (
    norm.includes("haath") ||
    norm.includes("phool") ||
    norm.includes("hand harness") ||
    norm.includes("hathphool")
  ) {
    return "JEWELRY FOCUS (Haath Phool): Show natural hand movement. Clearly show the physical connection between wrist bracelet, fingers, and decorative joining chains. Include a detailed macro shot of the hand jewelry.";
  }
  if (norm.includes("ring") || norm.includes("band")) {
    return "JEWELRY FOCUS (Rings): Naturally position the ring on the model's finger. Include natural hand movement, capturing a macro close-up of the center gemstone facets, setting, and precious metal band.";
  }

  return `JEWELRY FOCUS (${category}): The jewelry is the hero of the video. Keep the uploaded jewelry clearly visible and physically attached to the correct body location. Capture a detailed macro/micro product shot highlighting craftsmanship, gemstone placement, and pristine metal luster.`;
}

/**
 * Builds the comprehensive 7-scene UGC Cinematic Video Prompt based on the user's master specification
 */
export function buildUgcCinematicPrompt(options: BuildVideoPromptOptions | string = {}): string {
  const opts: BuildVideoPromptOptions =
    typeof options === "string" ? { category: options } : options;
  const category = opts.category || "Mangalsutra";
  const duration = opts.durationSeconds || 18;
  const isMangalsutra = (category || "").toLowerCase().includes("mangalsutra");

  const productTitle = isMangalsutra
    ? "Direct Gold Plated Mangalsutra No.132 MK"
    : `exact ${category}`;

  const elementsDesc = isMangalsutra
    ? "The mangalsutra, pendant, black beads, gold detailing, gemstones, earrings, proportions, pattern, and craftsmanship"
    : `The ${category}, pendant/centerpiece, chain/structure, gold detailing, gemstones, matching earrings, proportions, pattern, and craftsmanship`;

  const scene1Show = isMangalsutra
    ? "Show the full mangalsutra and matching earrings."
    : `Show the full ${category} and matching earrings.`;

  const scene2Wear = isMangalsutra
    ? "wearing the exact same mangalsutra and matching earrings."
    : `wearing the exact same ${category} and matching earrings.`;

  const scene3Macro = isMangalsutra
    ? "Cinematic macro camera movement toward the pendant. Show the intricate gold craftsmanship, black-bead chain, colored gemstones and hanging elements. Realistic gold reflections and tiny natural movements. Camera slowly moves from the chain toward the pendant."
    : `Cinematic macro camera movement toward the centerpiece. Show the intricate gold craftsmanship, chain / structure, colored gemstones and hanging elements. Realistic gold reflections and tiny natural movements. Camera slowly moves from the chain toward the pendant.`;

  const scene5Adjust = isMangalsutra
    ? "Model naturally adjusts the mangalsutra with her fingers and looks down at it, then looks back toward the camera. Make the moment feel like an authentic luxury UGC jewelry recommendation rather than a traditional commercial. Natural body movement, realistic facial expression and eye movement."
    : `Model naturally adjusts the ${category} with her fingers and looks down at it, then looks back toward the camera. Make the moment feel like an authentic luxury UGC jewelry recommendation rather than a traditional commercial. Natural body movement, realistic facial expression and eye movement.`;

  if (opts.customPrompt && opts.customPrompt.trim().length > 30) {
    return [
      opts.customPrompt.trim(),
      `Ensure 100% exact reference product preservation for ${category}.`,
      "Photorealistic live-action UGC cinematic jewelry video, 35mm and 85mm lenses, natural lighting, zero deformation.",
    ].join("\n\n");
  }

  return [
    `🎬 UGC Cinematic Video Prompt\n\nReference image: Use the uploaded ${category} jewelry image/storyboard as the exact product reference.`,
    `Create a photorealistic premium UGC-style cinematic jewelry advertisement, 15–20 seconds long, featuring the exact ${productTitle} shown in the reference image.`,
    `CRITICAL PRODUCT PRESERVATION: ${elementsDesc} must remain identical to the reference product in every shot. Do not redesign, simplify, add, remove, or morph any jewelry elements.`,
    `Scene 1 — Product Introduction | 0–2.5s\nStart with the complete jewelry set on a dark elegant jewelry mannequin/display stand. Slow cinematic camera push-in. ${scene1Show} Warm natural golden lighting, realistic reflections on gold, shallow depth of field, luxury Indian jewelry showroom atmosphere.`,
    `Scene 2 — Model Wearing Jewelry | 2.5–5.5s\nCut naturally to a beautiful Indian woman ${scene2Wear} Elegant cream/gold saree, natural makeup, subtle bindi, realistic skin texture. Medium front shot. She gently turns toward the camera and gives a natural subtle smile.`,
    `Scene 3 — Pendant Macro Shot | 5.5–8s\n${scene3Macro}`,
    `Scene 4 — Side / Earring Shot | 8–10.5s\nModel turns her face naturally to a 3/4 side angle. Focus on the matching earring. Hair moves slightly naturally. Camera performs a smooth slow orbit. Capture realistic gold shine and detailed earring craftsmanship.`,
    `Scene 5 — Lifestyle UGC Moment | 10.5–13.5s\n${scene5Adjust}`,
    `Scene 6 — Full Jewelry Beauty Shot | 13.5–16.5s\nMedium-to-full portrait of the model wearing the complete jewelry set. She slowly walks forward or turns naturally while the camera tracks backward. Cream/gold Indian festive environment, warm practical lights, subtle background bokeh.`,
    `Scene 7 — Final Hero Shot | 16.5–20s\nEnd with a beautiful close-to-medium portrait of the model wearing the complete set. Slow camera push-in toward the pendant and face. Finish with a clean luxury composition.`,
    `Visual style: photorealistic, premium Indian jewelry campaign, authentic UGC feeling, cinematic but natural, realistic human skin, realistic hair, physically accurate gold reflections, natural jewelry movement, warm neutral lighting, soft shadows, shallow depth of field, 4K detail, high-end DSLR/cinema camera look.`,
    `Camera: 35mm and 85mm cinematic lenses, slow dolly movements, subtle handheld micro-movement where appropriate, smooth tracking, macro focus pulls, realistic depth of field.`,
    `Lighting: soft natural window light mixed with warm practical lights, no artificial plastic-looking highlights, realistic gold reflections.`,
    `Motion: natural human movement, natural blinking, subtle breathing, realistic hand movement, realistic jewelry physics. No frozen face, no unnatural body movement.`,
    `Overall feeling: authentic Indian woman wearing beautiful jewelry in real life, elegant, aspirational, premium, trustworthy, not obviously AI-generated.`,
    `Best format: 9:16 vertical, 1080p/4K, 24fps, 15–20 seconds.`,
  ].join("\n\n");
}

/**
 * Builds the comprehensive, photorealistic luxury jewelry video campaign prompt.
 * Seamlessly integrates the master requirements, category focus, model choreography, and motion styles.
 */
export function buildVideoPrompt(options: BuildVideoPromptOptions | string = {}): string {
  // Support string input shorthand
  const opts: BuildVideoPromptOptions =
    typeof options === "string" ? { category: options } : options;

  const category = opts.category || "jewelry";
  const motionStyle = opts.motionStyle || "head-turn";
  const duration = opts.durationSeconds || 15;

  // Delegate directly to the 7-scene UGC Cinematic Engine if ugc-cinematic is selected
  if (motionStyle === "ugc-cinematic") {
    return buildUgcCinematicPrompt(opts);
  }

  const motionDirectives: Record<string, string> = {
    "head-turn":
      "Model slowly and elegantly turns her head toward the soft studio light, softly blinking, revealing a subtle regal smile while diamond and metal reflections shimmer naturally.",
    "editorial-smile":
      "Model gently tilts her chin up, looking into the camera with serene editorial confidence, soft eye contact, gentle breathing, jewelry catching warm studio highlights.",
    "subtle-sparkle":
      "Slow micro-pan across the jewelry pieces, prismatic gemstone caustics and gleaming precious metal luster catching softbox lighting with ultra-realistic shine.",
    "runway-pose":
      "Slow-motion high-fashion commercial runway movement, model shoulders and head gently swaying with natural elegance, hair catching a soft studio breeze.",
  };

  const selectedMotion = motionDirectives[motionStyle] || motionDirectives["head-turn"];
  const jewelryFocus = getVideoJewelryFocusDirective(category);

  // If the user provided a full custom prompt override, honor it
  if (opts.customPrompt && opts.customPrompt.trim().length > 30) {
    return [
      opts.customPrompt.trim(),
      `Ensure 100% exact reference product preservation for ${category}.`,
      "Photorealistic live-action luxury fashion campaign, 35mm lens, natural lighting, zero deformation.",
    ].join("\n\n");
  }

  // Construct master prompt synthesizing all user specifications
  const promptParts = [
    `Create a photorealistic luxury jewelry fashion campaign video (${duration}s duration) using the uploaded ${category} product image as the EXACT REFERENCE PRODUCT.`,
    "The uploaded jewelry must be worn by a realistic human fashion model. Preserve the jewelry's exact design, shape, proportions, gemstone placement, metal color, texture, engraving, stones, setting, and overall appearance. Do not redesign, simplify, replace, duplicate, or invent any part of the jewelry.",
    `MODEL PERFORMANCE & CHOREOGRAPHY:\nStart with the model standing naturally in an elegant luxury fashion environment. The model slowly walks toward the camera with confident but natural movement. ${selectedMotion} Subtle natural movements: natural walking, gentle head movement, realistic blinking, subtle facial expression, natural hand movement, realistic fabric movement, slight hair movement, natural breathing and body motion. Avoid exaggerated posing or unnatural movements.`,
    `5-STAGE PROGRESSION:\n1. Full/medium fashion shot of model wearing jewelry.\n2. Camera smoothly moves closer to the jewelry.\n3. Detailed macro/micro product shot.\n4. Show jewelry from slightly different angle as model moves.\n5. Finish with a premium 2–3 second close-up hero shot of the jewelry with realistic gemstone reflections and metal highlights.`,
    jewelryFocus,
    "CAMERA DIRECTION & OPTICS:\nOpening medium/full-body fashion shot -> middle smooth tracking shot following walking model -> product reveal slow cinematic push-in -> macro extreme close-up with shallow depth of field -> final elegant hero shot. Use realistic 35mm lens behavior, natural depth of field, subtle focus transitions, and physically believable camera motion.",
    "LIGHTING & ENVIRONMENT:\nSoft natural luxury-fashion lighting (soft key light, subtle fill light, realistic highlights on metal, controlled gemstone reflections, natural shadows, soft background separation). Premium minimal luxury fashion studio environment with subtle neutral tones and slightly blurred editorial backdrop. Physically real live-action cinematography.",
    "PRODUCT FIDELITY & REALISM (CRITICAL):\nUploaded jewelry reference is the source of truth. Preserve exact jewelry design, shape, size relationship, gemstone count, gemstone arrangement, metal color, texture, decorative elements, and proportions. Never change the jewelry between shots. Real professional jewelry photoshoot aesthetic, not CGI.",
  ];

  return promptParts.join("\n\n");
}
