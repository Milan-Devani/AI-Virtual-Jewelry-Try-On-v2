import { AiModelConfig } from "../types/index.js";
import { getRegionalAttirePrompt } from "./attire/index.js";

export function buildPersonaPrompt(config?: AiModelConfig): string {
  if (!config) {
    return "The model is a stunning, elegant Indian model with radiant warm wheatish skin, natural dark hair styled elegantly, and a serene, poised luxury jewelry campaign expression.";
  }

  const genderTerm = config.gender === "male" ? "male model" : "female model";
  const skin = config.skinTone || "warm golden-wheatish skin tone with natural dewy radiance";
  const hair = `${config.hairType || "flowing wavy"} ${config.hairColor || "natural black"} hair styled elegantly`;
  const eyes = `${config.eyeColor || "deep brown"} expressive eyes`;
  const expression = config.expression || "serene, regal, and poised editorial expression";
  const attire = getRegionalAttirePrompt(config.clothingStyle || config.ethnicityRegion || "pan-indian");

  return `
[AI VIRTUAL MODEL PERSONA SPECIFICATION]
- Subject: Professional high-fashion ${genderTerm} for luxury jewelry campaign
- Skin: ${skin}
- Hair: ${hair}
- Eyes: ${eyes}
- Expression: ${expression}
- Attire & Cultural Styling:
${attire}
`.trim();
}
