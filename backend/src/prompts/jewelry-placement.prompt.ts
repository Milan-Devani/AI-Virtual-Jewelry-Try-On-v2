import { getCategoryById } from "../constants/categories.js";

export const BACKGROUND_PROMPTS: Record<string, string> = {
  studio: "clean premium jewelry studio background with soft directional commercial lighting",
  luxury: "elegant luxury Indian jewelry campaign environment with warm ambient reflections",
  minimal: "warm neutral minimalist fashion background with gentle gradient shadows",
  outdoor: "tasteful softly blurred outdoor fashion environment in golden hour natural light",
};

export function getPlacementPromptForCategory(
  categoryId: string,
  customName?: string,
  customPlacement?: string
): string {
  const category = getCategoryById(categoryId);
  if (category) {
    return category.promptInstructions;
  }

  // Custom Category prompt formulation
  const name = customName || categoryId;
  const placementLocation = customPlacement || "appropriate anatomical location";

  const isPairOrCombo = name.includes("+") || placementLocation.includes(",");
  const pairDirective = isPairOrCombo
    ? `\nMULTI-PIECE PAIR / COMBO INSTRUCTIONS:
This product set contains multiple coordinated jewelry pieces (${name}) for distinct anatomical body zones (${placementLocation}).
- Dress EACH designated piece accurately onto its matching anatomical target on the model (e.g. earrings/jhumkas on ears, necklace/pendant on neck, payal/anklet on ankles/feet, bangles/bracelets on wrists, rings on fingers).
- Erase, remove, and replace any pre-existing jewelry at ALL corresponding target body areas (${placementLocation}).
- Maintain consistent jewelry craftsmanship, metal luster, gemstone setting, and realistic lighting reflections across all pieces in the set.`
    : "";

  return `Place the exact jewelry product (${name}) naturally and seamlessly on the model's ${placementLocation}.
Preserve:
- full jewelry geometry and craftsmanship
- gemstones, metalwork, and delicate ornaments
- proportions and natural perspective
Make it physically wrap or attach to the model's ${placementLocation} with realistic contact shadows and photorealistic reflections.${pairDirective}`;
}

export function getBackgroundPrompt(background?: string): string {
  if (!background) return BACKGROUND_PROMPTS.studio;
  return BACKGROUND_PROMPTS[background.toLowerCase()] || BACKGROUND_PROMPTS.studio;
}
