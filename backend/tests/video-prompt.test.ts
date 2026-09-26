import { describe, it, expect } from "vitest";
import {
  MASTER_VIDEO_PROMPT_CORE,
  VIDEO_NEGATIVE_PROMPT,
  getVideoJewelryFocusDirective,
  buildVideoPrompt,
} from "../src/prompts/video.prompt.js";

describe("Photorealistic Luxury Jewelry Fashion Campaign Video Prompt Engine", () => {
  it("contains verbatim master video requirements in MASTER_VIDEO_PROMPT_CORE", () => {
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("Create a photorealistic luxury jewelry fashion campaign video");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("exact reference product");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("Do not redesign, simplify, replace, duplicate, or invent any part of the jewelry");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("Duration: 15–20 seconds");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("luxury jewelry commercial / premium fashion photoshoot");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("Photorealistic live-action appearance");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("No artificial-looking CGI appearance");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("5. Finish with a premium close-up hero shot of the jewelry");
    expect(MASTER_VIDEO_PROMPT_CORE).toContain("PRODUCT FIDELITY — CRITICAL");
  });

  it("contains all critical anti-AI negative prompt terms in VIDEO_NEGATIVE_PROMPT", () => {
    const requiredNegativeTerms = [
      "AI-looking faces",
      "plastic skin",
      "wax skin",
      "distorted hands",
      "extra fingers",
      "missing fingers",
      "deformed body",
      "unnatural walking",
      "floating jewelry",
      "detached jewelry",
      "duplicated jewelry",
      "changing jewelry design",
      "incorrect jewelry placement",
      "melted gemstones",
      "distorted metal",
      "fake reflections",
      "excessive glow",
      "CGI appearance",
      "cartoon style",
      "animation style",
      "unrealistic camera movement",
      "flickering",
      "frame-to-frame product changes",
      "inconsistent face",
      "inconsistent clothing",
      "inconsistent body proportions",
      "unstable background",
      "excessive motion blur",
      "oversaturated colors",
      "artificial lighting",
      "low-detail jewelry",
      "blurry product",
      "warped jewelry",
      "duplicated accessories",
      "extra accessories",
    ];

    requiredNegativeTerms.forEach((term) => {
      expect(VIDEO_NEGATIVE_PROMPT).toContain(term);
    });
  });

  it("generates category-specific focus directives for all required jewelry types", () => {
    // Earrings
    const earringsFocus = getVideoJewelryFocusDirective("Earrings");
    expect(earringsFocus).toContain("side and profile angle");
    expect(earringsFocus).toContain("macro close-up showing stones");

    // Necklaces & Pendants
    const necklaceFocus = getVideoJewelryFocusDirective("Necklaces & Pendants");
    expect(necklaceFocus).toContain("sitting naturally on the neck and chest");
    expect(necklaceFocus).toContain("Camera slowly moves toward the pendant");

    // Bracelets & Wristwear
    const braceletFocus = getVideoJewelryFocusDirective("Bracelets & Wristwear");
    expect(braceletFocus).toContain("position the bracelet on the model's wrist");
    expect(braceletFocus).toContain("macro shot of the bracelet from multiple angles");

    // Jhumkas
    const jhumkaFocus = getVideoJewelryFocusDirective("Jhumkas");
    expect(jhumkaFocus).toContain("3/4 angle");
    expect(jhumkaFocus).toContain("bell shape, hanging latkan elements");

    // Payal / Anklets
    const payalFocus = getVideoJewelryFocusDirective("Payal / Anklets");
    expect(payalFocus).toContain("walking naturally");
    expect(payalFocus).toContain("focus the camera toward the ankle");
    expect(payalFocus).toContain("payal moving naturally with each step");

    // Maang Tikka
    const tikkaFocus = getVideoJewelryFocusDirective("Maang Tikka");
    expect(tikkaFocus).toContain("centered naturally on the forehead");
    expect(tikkaFocus).toContain("hair parting");

    // Haath Phool
    const haathPhoolFocus = getVideoJewelryFocusDirective("Haath Phool");
    expect(haathPhoolFocus).toContain("wrist bracelet, fingers, and decorative joining chains");

    // Rings
    const ringFocus = getVideoJewelryFocusDirective("Rings");
    expect(ringFocus).toContain("ring on the model's finger");
    expect(ringFocus).toContain("center gemstone facets");
  });

  it("builds a complete video campaign prompt with motion style, 5-stage walk, and camera directions", () => {
    const prompt = buildVideoPrompt({
      category: "Necklaces & Pendants",
      motionStyle: "editorial-smile",
      durationSeconds: 18,
    });

    expect(prompt).toContain("photorealistic luxury jewelry fashion campaign video");
    expect(prompt).toContain("18s duration");
    expect(prompt).toContain("EXACT REFERENCE PRODUCT");
    expect(prompt).toContain("Do not redesign, simplify, replace, duplicate, or invent any part of the jewelry");
    expect(prompt).toContain("MODEL PERFORMANCE & CHOREOGRAPHY");
    expect(prompt).toContain("editorial confidence");
    expect(prompt).toContain("5-STAGE PROGRESSION");
    expect(prompt).toContain("CAMERA DIRECTION & OPTICS");
    expect(prompt).toContain("LIGHTING & ENVIRONMENT");
    expect(prompt).toContain("PRODUCT FIDELITY & REALISM (CRITICAL)");
  });

  it("supports custom prompt override with jewelry preservation guardrails", () => {
    const customPrompt = "Exclusive high-end Parisian couture showcase featuring an emerald necklace.";
    const result = buildVideoPrompt({
      category: "necklace",
      customPrompt,
    });

    expect(result).toContain(customPrompt);
    expect(result).toContain("Ensure 100% exact reference product preservation for necklace.");
    expect(result).toContain("Photorealistic live-action luxury fashion campaign");
  });

  it("builds a dedicated 7-scene UGC cinematic lifestyle video prompt with exact product preservation", () => {
    const prompt = buildVideoPrompt({
      category: "Mangalsutra",
      motionStyle: "ugc-cinematic",
      durationSeconds: 18,
    });

    expect(prompt).toContain("🎬 UGC Cinematic Video Prompt");
    expect(prompt).toContain("Direct Gold Plated Mangalsutra No.132 MK");
    expect(prompt).toContain("CRITICAL PRODUCT PRESERVATION");
    expect(prompt).toContain("Scene 1 — Product Introduction | 0–2.5s");
    expect(prompt).toContain("Scene 2 — Model Wearing Jewelry | 2.5–5.5s");
    expect(prompt).toContain("Scene 3 — Pendant Macro Shot | 5.5–8s");
    expect(prompt).toContain("Scene 4 — Side / Earring Shot | 8–10.5s");
    expect(prompt).toContain("Scene 5 — Lifestyle UGC Moment | 10.5–13.5s");
    expect(prompt).toContain("Scene 6 — Full Jewelry Beauty Shot | 13.5–16.5s");
    expect(prompt).toContain("Scene 7 — Final Hero Shot | 16.5–20s");
    expect(prompt).toContain("Visual style: photorealistic, premium Indian jewelry campaign");
    expect(prompt).toContain("Camera: 35mm and 85mm cinematic lenses");
    expect(prompt).toContain("Lighting: soft natural window light");
    expect(prompt).toContain("Motion: natural human movement, natural blinking");
    expect(prompt).toContain("Best format: 9:16 vertical, 1080p/4K, 24fps");
  });

  it("locks 8-shot storyboard references when multiple generated images are provided", () => {
    const mockShots = [
      "https://example.com/shot_1.webp",
      "https://example.com/shot_2.webp",
      "https://example.com/shot_3.webp",
      "https://example.com/shot_4.webp",
      "https://example.com/shot_5.webp",
      "https://example.com/shot_6.webp",
      "https://example.com/shot_7.webp",
      "https://example.com/shot_8.webp",
    ];

    const prompt = buildVideoPrompt({
      category: "Mangalsutra",
      motionStyle: "ugc-cinematic",
      durationSeconds: 20,
      storyboardImages: mockShots,
    });

    expect(prompt).toContain("STORYBOARD REFERENCE & PRODUCT IDENTITY LOCK");
    expect(prompt).toContain("All 8 generated campaign shots");
    expect(prompt).toContain("Mannequin Showcase, Model Front, Pendant Macro, Earring Side, Earring Macro, Lifestyle UGC, Flat Lay, Hero Portrait");
    expect(prompt).toContain("locked visual reference frames");
  });

  it("dynamically adapts 7-scene UGC cinematic prompt to other categories without breaking", () => {
    // Jhumkas / Earrings
    const earringsPrompt = buildVideoPrompt({
      category: "Jhumkas",
      motionStyle: "ugc-cinematic",
      durationSeconds: 18,
      storyboardImages: ["s1.webp", "s2.webp"],
    });

    expect(earringsPrompt).toContain("🎬 UGC Cinematic Video Prompt");
    expect(earringsPrompt).toContain("exact Direct Gold Plated Jhumkas Set");
    expect(earringsPrompt).toContain("Scene 1 — Product Introduction | 0–2.5s");
    expect(earringsPrompt).toContain("Scene 2 — Model Wearing Jewelry | 2.5–5.5s");
    expect(earringsPrompt).toContain("Scene 3 — Macro Shot | 5.5–8s");
    expect(earringsPrompt).toContain("Scene 4 — Angle & Detail Shot | 8–10.5s");
    expect(earringsPrompt).toContain("Scene 5 — Lifestyle UGC Moment | 10.5–13.5s");
    expect(earringsPrompt).toContain("STORYBOARD REFERENCE & PRODUCT IDENTITY LOCK: All 2 generated campaign shots");

    // Bangles
    const banglesPrompt = buildVideoPrompt({
      category: "Bangles",
      motionStyle: "ugc-cinematic",
      durationSeconds: 15,
    });
    expect(banglesPrompt).toContain("exact Direct Gold Plated Bangles");
    expect(banglesPrompt).toContain("wrist");

    // Rings
    const ringsPrompt = buildVideoPrompt({
      category: "Rings",
      motionStyle: "ugc-cinematic",
      durationSeconds: 15,
    });
    expect(ringsPrompt).toContain("exact Direct Gold Plated Rings");
    expect(ringsPrompt).toContain("ring finger");
  });
});
