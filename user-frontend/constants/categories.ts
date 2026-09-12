import { JewelryCategory } from "../types";

export const JEWELRY_CATEGORIES: JewelryCategory[] = [
  // --- Women's Jewelry ---
  {
    id: "earrings",
    name: "Earrings",
    placement: "ears",
    gender: "female",
    description: "Classic drops, studs, chandeliers, hoops, & ear cuffs",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "necklaces-pendants",
    name: "Necklaces & Pendants",
    placement: "neck",
    gender: "female",
    description: "Chokers, collar necklaces, layered strings, pendants, & haar",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "bracelets-wristwear",
    name: "Bracelets & Wristwear",
    placement: "wrist",
    gender: "female",
    description: "Kadas, bangles, charm bracelets, tennis bracelets, & cuffs",
    suggestedAspectRatio: "1:1",
  },
  {
    id: "jhumkas",
    name: "Jhumkas",
    placement: "ears",
    gender: "female",
    description: "Traditional bell-shaped earrings with dome drops & latkans",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "payal-anklets",
    name: "Payal / Anklets",
    placement: "ankles",
    gender: "female",
    description: "Traditional payal, silver/gold anklets, & ghungroo chains",
    suggestedAspectRatio: "3:4",
  },
  {
    id: "maang-tikka",
    name: "Maang Tikka",
    placement: "forehead",
    gender: "female",
    description: "Forehead centerpiece, matha patti, & bridal hair ornaments",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "haath-phool",
    name: "Haath Phool",
    placement: "hand",
    gender: "female",
    description: "Hand harness connecting wrist bracelet to finger rings via chains",
    suggestedAspectRatio: "1:1",
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    placement: "neck",
    gender: "female",
    description: "Traditional sacred black-beaded gold chain necklace with central pendant",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "mangalsutra-earrings",
    name: "Mangalsutra with Earrings",
    placement: "neck & ears",
    gender: "female",
    description: "Matching set with auspicious mangalsutra necklace and coordinating earrings",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "full-bridal-set",
    name: "Full Bridal / All-in-One Set",
    placement: "full body / all",
    gender: "female",
    description: "Complete set: Necklace, Earrings, Maang Tikka, Bangles & Nath worn together",
    suggestedAspectRatio: "4:5",
  },

  // --- Men's Jewelry ---
  {
    id: "mens-chains",
    name: "Men's Chains & Pendants",
    placement: "neck & chest",
    gender: "male",
    description: "Gold & silver chains, curb link necklaces, rudraksha mala, & religious pendants",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "mens-kada",
    name: "Men's Kada & Bracelets",
    placement: "wrist",
    gender: "male",
    description: "Traditional heavy Punjabi kada, silver/gold wrist kada, & link bracelets",
    suggestedAspectRatio: "1:1",
  },
  {
    id: "mens-rings",
    name: "Men's Rings & Bands",
    placement: "finger",
    gender: "male",
    description: "Signet rings, astrological gemstone rings, platinum bands, & royal bands",
    suggestedAspectRatio: "1:1",
  },
  {
    id: "mens-brooch-kalgi",
    name: "Brooch & Turban Kalgi",
    placement: "chest / turban",
    gender: "male",
    description: "Royal sherwani brooch, suit lapel pins, & wedding safa/turban kalgi ornaments",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "mens-kurta-buttons",
    name: "Kurta Buttons & Cufflinks",
    placement: "chest / cuffs",
    gender: "male",
    description: "Ornamental chained kurta button sets & luxury formal cufflinks",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "mens-groom-mala",
    name: "Groom Moti Mala / Royal Haar",
    placement: "neck & chest",
    gender: "male",
    description: "Traditional multi-strand pearl mala, emerald kanthi haar, & royal groom necklaces",
    suggestedAspectRatio: "4:5",
  },
  {
    id: "mens-studs",
    name: "Men's Ear Studs & Bali",
    placement: "ears",
    gender: "male",
    description: "Single or paired diamond studs, gold bali earrings, & ear cuffs for men",
    suggestedAspectRatio: "4:5",
  },
];

export const BACKGROUND_OPTIONS = [
  { id: "studio", name: "Studio", description: "Clean luxury studio lighting" },
  { id: "luxury", name: "Luxury", description: "Warm Indian ambient campaign" },
  { id: "minimal", name: "Minimal", description: "Neutral soft editorial shadow" },
  { id: "outdoor", name: "Outdoor", description: "Golden hour diffused bokeh" },
] as const;

export const RATIO_OPTIONS = [
  { id: "4:5", label: "4:5 (E-commerce / Editorial)" },
  { id: "1:1", label: "1:1 (Square / Feed)" },
  { id: "3:4", label: "3:4 (Portrait Standard)" },
  { id: "16:9", label: "16:9 (Landscape Banner)" },
] as const;

export const QUALITY_OPTIONS = [
  { id: "2K", label: "2K Ultra HD (Recommended)" },
  { id: "1K", label: "1K Standard (Fast)" },
  { id: "4K", label: "4K Master (Editorial)" },
] as const;
