import { gujaratiAttirePrompt } from "./gujarati.js";
import { southIndiaAttirePrompt } from "./south-india.js";
import { maharashtraAttirePrompt } from "./maharashtra.js";
import { punjabAttirePrompt } from "./punjab.js";
import { keralaAttirePrompt } from "./kerala.js";
import { bengalAttirePrompt } from "./bengal.js";
import { rajasthanAttirePrompt } from "./rajasthan.js";
import { mensAttirePrompt } from "./mens.js";

export function getRegionalAttirePrompt(attireId: string): string {
  switch (attireId) {
    case "gujarati":
    case "gujarati-panetar":
    case "gujarati-gharchola":
      return gujaratiAttirePrompt;

    case "south-indian":
    case "south-indian-kanjeevaram":
    case "tamil-nadu":
      return southIndiaAttirePrompt;

    case "maharashtrian":
    case "maharashtrian-nauvari":
    case "maharashtrian-paithani":
      return maharashtraAttirePrompt;

    case "punjabi":
    case "punjabi-phulkari":
      return punjabAttirePrompt;

    case "kerala":
    case "kerala-kasavu":
      return keralaAttirePrompt;

    case "bengali":
    case "bengali-lal-par":
      return bengalAttirePrompt;

    case "rajasthani":
    case "rajasthani-rajputi":
      return rajasthanAttirePrompt;

    case "mens-sherwani":
    case "mens-bandhgala":
    case "mens-kurta":
    case "mens-tuxedo":
      return mensAttirePrompt(attireId);

    case "western":
      return `
- Attire Style: Haute Couture Luxury Western Evening Attire
- Attire Specifications: Impeccably tailored luxury silk-satin or velvet evening gown with sculpted neckline and refined haute-couture silhouette.
- Realism: Fluid satin sheen, natural draped folds, editorial Vogue-level fashion styling.
`;

    case "pan-indian":
    default:
      return `
- Attire Style: Opulent Contemporary Indian Bridal Couture
- Attire Specifications: Luxurious hand-woven silk or velvet bridal ensemble in regal crimson or champagne gold with delicate handcrafted zardozi and thread embroidery.
- Realism: Tactile embroidery detail, luminous silk drape, authentic wedding jewelry styling.
`;
  }
}
