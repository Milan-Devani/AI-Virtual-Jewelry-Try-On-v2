export interface PresetOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon?: string;
  gender?: "female" | "male" | "all";
}

export const REGIONAL_ATTIRES: PresetOption[] = [
  // --- Women's Regional Indian Attires ---
  {
    id: "gujarati",
    name: "Gujarati Panetar & Gharchola",
    description: "Red & white Panetar silk saree / Chaniya Choli with real gold zari & Bandhani",
    badge: "Gujarat",
    gender: "female",
  },
  {
    id: "south-indian",
    name: "South Indian Kanjeevaram Silk",
    description: "Lustrous pure Kanchipuram silk saree with rich golden temple zari borders",
    badge: "South India",
    gender: "female",
  },
  {
    id: "maharashtrian",
    name: "Maharashtrian Nauvari Paithani",
    description: "Royal 9-yard Nauvari Paithani silk saree with signature peacock motifs & golden pallu",
    badge: "Maharashtra",
    gender: "female",
  },
  {
    id: "punjabi",
    name: "Punjabi Phulkari & Bridal Lehenga",
    description: "Heavily embellished bridal lehenga choli / ornate Phulkari silk suit with gotta patti",
    badge: "Punjab",
    gender: "female",
  },
  {
    id: "kerala",
    name: "Kerala Kasavu Gold Saree",
    description: "Graceful pure off-white silk saree with radiant pure gold zari border (Mundu Neriyathu)",
    badge: "Kerala",
    gender: "female",
  },
  {
    id: "bengali",
    name: "Bengali Lal Par Sada Silk",
    description: "Iconic white silk saree with broad crimson-red borders & subtle traditional artistry",
    badge: "West Bengal",
    gender: "female",
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu Kanchipuram Temple Saree",
    description: "Traditional contrast gold zari temple saree with classic Madurai borders",
    badge: "Tamil Nadu",
    gender: "female",
  },
  {
    id: "rajasthani",
    name: "Rajasthani Rajputi Poshak",
    description: "Royal Marwari Gota Patti lehenga with heavily bordered sheer odhni",
    badge: "Rajasthan",
    gender: "female",
  },
  {
    id: "assamese",
    name: "Assamese Muga Silk Mekhela Sador",
    description: "Natural golden-luster Muga silk with traditional red and black Kingkhap weave motifs",
    badge: "Assam",
    gender: "female",
  },
  {
    id: "pan-indian",
    name: "Modern Indian Couture Lehenga",
    description: "Contemporary haute couture bridal lehenga with delicate zardozi embroidery",
    badge: "Couture",
    gender: "female",
  },
  {
    id: "western",
    name: "Western Haute Couture Evening Gown",
    description: "Tailored minimalist silk satin evening gown / luxury cocktail décolletage",
    badge: "Western",
    gender: "female",
  },

  // --- Men's Attires ---
  {
    id: "mens-sherwani",
    name: "Royal Embroidered Sherwani",
    description: "Bespoke raw silk ivory/champagne gold groom sherwani with ornate placket",
    badge: "Royal Groom",
    gender: "male",
  },
  {
    id: "mens-bandhgala",
    name: "Jodhpuri Royal Bandhgala",
    description: "Distinguished velvet / dark jacquard tailored Jodhpuri closed-neck suit",
    badge: "Heritage",
    gender: "male",
  },
  {
    id: "mens-kurta",
    name: "Luxury Silk Kurta & Safa",
    description: "Crisp festive embroidered silk kurta with optional wedding safa",
    badge: "Festive",
    gender: "male",
  },
  {
    id: "mens-tuxedo",
    name: "Black-Tie Western Tuxedo",
    description: "Classic luxury black tuxedo with satin silk lapels and formal dress shirt",
    badge: "Western",
    gender: "male",
  },
];

export const SKIN_TONES = [
  { id: "fair", name: "Fair / Porcelain", colorHex: "#FCE4D6", desc: "Radiant porcelain with warm undertones" },
  { id: "wheatish", name: "Wheatish / Warm Olive", colorHex: "#ECC8A0", desc: "Natural warm golden Indian glow" },
  { id: "dusky", name: "Dusky / Golden Honey", colorHex: "#C99A6B", desc: "Sun-kissed honey with rich radiance" },
  { id: "deep", name: "Deep Caramel / Dark", colorHex: "#8D5837", desc: "Smooth velvet caramel with soft highlights" },
];

export const HAIR_TYPES = [
  { id: "wavy", name: "Natural Wavy", desc: "Voluminous soft natural waves" },
  { id: "straight", name: "Sleek Straight", desc: "Polished smooth straight hair" },
  { id: "curly", name: "Lustrous Curly", desc: "Defined bouncy natural curls" },
  { id: "coily", name: "Textured Coily", desc: "Rich textured tight coils" },
  { id: "bridal-updo", name: "Bridal Updo / Bun (Gajra)", desc: "Traditional floral bun with fresh jasmine" },
  { id: "traditional-braid", name: "Traditional Braid (Jada)", desc: "Long decorated braid draped over shoulder" },
];

export const HAIR_COLORS = [
  { id: "natural-black", name: "Natural Black", colorHex: "#1A1715" },
  { id: "dark-brown", name: "Dark Espresso", colorHex: "#362419" },
  { id: "chestnut", name: "Warm Chestnut", colorHex: "#59331D" },
  { id: "burgundy", name: "Burgundy Tint", colorHex: "#5B1924" },
  { id: "blonde", name: "Honey Blonde", colorHex: "#C49E60" },
];

export const EYE_COLORS = [
  { id: "deep-brown", name: "Deep Brown", colorHex: "#3B271A" },
  { id: "amber-hazel", name: "Amber / Hazel", colorHex: "#8C6239" },
  { id: "black", name: "Glossy Black", colorHex: "#111111" },
  { id: "forest-green", name: "Forest Green", colorHex: "#2D5A3C" },
  { id: "slate-gray", name: "Slate Gray", colorHex: "#5C6B73" },
];

export interface ArchetypePreset {
  id: string;
  name: string;
  subtitle: string;
  gender: "female" | "male";
  config: {
    ethnicityRegion: string;
    clothingStyle: string;
    skinTone: string;
    hairType: string;
    hairColor: string;
    eyeColor: string;
  };
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: "gujarati-bride",
    name: "Royal Gujarati Bride",
    subtitle: "Panetar Silk • Wheatish • Bridal Bun",
    gender: "female",
    config: {
      ethnicityRegion: "gujarati",
      clothingStyle: "gujarati",
      skinTone: "wheatish",
      hairType: "bridal-updo",
      hairColor: "natural-black",
      eyeColor: "deep-brown",
    },
  },
  {
    id: "south-indian-temple",
    name: "Kanjeevaram Temple Queen",
    subtitle: "Kanchipuram Silk • Dusky • Long Braid",
    gender: "female",
    config: {
      ethnicityRegion: "south-indian",
      clothingStyle: "south-indian",
      skinTone: "dusky",
      hairType: "traditional-braid",
      hairColor: "natural-black",
      eyeColor: "black",
    },
  },
  {
    id: "marwari-maharani",
    name: "Rajasthani Maharani",
    subtitle: "Rajputi Poshak • Fair • Gota Patti",
    gender: "female",
    config: {
      ethnicityRegion: "rajasthani",
      clothingStyle: "rajasthani",
      skinTone: "fair",
      hairType: "wavy",
      hairColor: "natural-black",
      eyeColor: "amber-hazel",
    },
  },
  {
    id: "maharashtrian-paithani",
    name: "Nauvari Paithani Princess",
    subtitle: "Nauvari Silk • Wheatish • Peacock Pallu",
    gender: "female",
    config: {
      ethnicityRegion: "maharashtrian",
      clothingStyle: "maharashtrian",
      skinTone: "wheatish",
      hairType: "bridal-updo",
      hairColor: "natural-black",
      eyeColor: "deep-brown",
    },
  },
  {
    id: "western-editorial",
    name: "Haute Couture Editorial",
    subtitle: "Silk Gown • Fair • Sleek Waves",
    gender: "female",
    config: {
      ethnicityRegion: "western",
      clothingStyle: "western",
      skinTone: "fair",
      hairType: "wavy",
      hairColor: "dark-brown",
      eyeColor: "forest-green",
    },
  },
  {
    id: "royal-groom",
    name: "Royal Indian Groom",
    subtitle: "Raw Silk Sherwani • Wheatish • Royal Cut",
    gender: "male",
    config: {
      ethnicityRegion: "punjabi",
      clothingStyle: "mens-sherwani",
      skinTone: "wheatish",
      hairType: "straight",
      hairColor: "natural-black",
      eyeColor: "deep-brown",
    },
  },
  {
    id: "jodhpuri-prince",
    name: "Jodhpuri Heritage Bandhgala",
    subtitle: "Velvet Bandhgala • Dusky • Classic Look",
    gender: "male",
    config: {
      ethnicityRegion: "rajasthani",
      clothingStyle: "mens-bandhgala",
      skinTone: "dusky",
      hairType: "straight",
      hairColor: "natural-black",
      eyeColor: "amber-hazel",
    },
  },
];
