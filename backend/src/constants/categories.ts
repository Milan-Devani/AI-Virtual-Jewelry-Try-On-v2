export interface JewelryCategory {
  id: string;
  name: string;
  placement: string;
  gender?: "female" | "male" | "unisex";
  description: string;
  promptInstructions: string;
  suggestedAspectRatio: "1:1" | "3:4" | "4:5" | "16:9";
}

export const JEWELRY_CATEGORIES: JewelryCategory[] = [
  // --- Women's & Unisex Jewelry ---
  {
    id: "earrings",
    name: "Earrings",
    placement: "ears",
    gender: "female",
    description: "Classic drops, studs, chandeliers, hoops, and ear cuffs",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact jewelry product naturally on the model's ears.
If the model is already wearing any existing earrings, studs, or drops, COMPLETELY REMOVE AND ERASE THEM. Do not merge or layer old and new earrings. Cleanly inpaint the earlobes so only the new product earrings are worn.
If the product contains a pair, use the same design on both ears.
The earrings must attach naturally to the ears.
Preserve:
- shape
- stones
- metalwork
- hanging elements
- proportions
- color
Do not redesign the earrings.`
  },
  {
    id: "necklaces-pendants",
    name: "Necklaces & Pendants",
    placement: "neck",
    gender: "female",
    description: "Chokers, collar necklaces, layered strings, pendants, and haar",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact necklace or pendant naturally around the model's neck and upper chest.
If the model is already wearing any pre-existing necklace, choker, chain, or mangalsutra, COMPLETELY REMOVE, ERASE, AND REPLACE IT. Do not layer, merge, or double-wear necklaces. Seamlessly inpaint the neck and collarbones with bare natural skin before placing this necklace.
Preserve the exact:
- chain
- pendant
- gemstones
- metalwork
- proportions
- design
Make the necklace follow the natural anatomy and perspective of the neck.`
  },
  {
    id: "bracelets-wristwear",
    name: "Bracelets & Wristwear",
    placement: "wrist",
    gender: "female",
    description: "Kadas, bangles, charm bracelets, tennis bracelets, and cuffs",
    suggestedAspectRatio: "1:1",
    promptInstructions: `Place the exact bracelet or wristwear naturally around the model's wrist.
Preserve:
- bracelet structure
- stones
- charms
- metalwork
- proportions
- color
Make it physically wrap around the wrist with realistic contact shadows.`
  },
  {
    id: "jhumkas",
    name: "Jhumkas",
    placement: "ears",
    gender: "female",
    description: "Traditional bell-shaped earrings with dome drops and latkans",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact jhumka jewelry naturally on the model's ears.
If the model is already wearing any existing earrings, studs, or hoops, COMPLETELY REMOVE AND ERASE THEM. Cleanly restore the earlobe skin and attach ONLY the new jhumkas.
Preserve:
- bell shape
- hanging elements
- beads
- stones
- metalwork
- proportions
Do not simplify or redesign the jhumka.`
  },
  {
    id: "payal-anklets",
    name: "Payal / Anklets",
    placement: "ankles",
    gender: "female",
    description: "Traditional payal, silver/gold anklets, and ghungroo chains",
    suggestedAspectRatio: "3:4",
    promptInstructions: `Place the exact payal/anklet naturally around the model's ankle.
Preserve:
- chain
- charms
- bells
- stones
- metalwork
- proportions
The anklet must follow the ankle anatomy naturally.`
  },
  {
    id: "maang-tikka",
    name: "Maang Tikka",
    placement: "forehead",
    gender: "female",
    description: "Forehead centerpiece, matha patti, and bridal hair ornaments",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact maang tikka naturally along the model's hair parting and centered on the forehead.
Preserve:
- central pendant
- chain
- stones
- decorative elements
- metalwork
- proportions
The chain should follow the natural hairline.`
  },
  {
    id: "haath-phool",
    name: "Haath Phool",
    placement: "hand",
    gender: "female",
    description: "Hand harness connecting wrist bracelet to finger rings via chains",
    suggestedAspectRatio: "1:1",
    promptInstructions: `Place the exact haath phool naturally on the model's hand.
Preserve:
- bracelet portion
- finger ring
- connecting chain
- stones
- metalwork
- proportions
The connecting chain must naturally follow the hand anatomy.`
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    placement: "neck",
    gender: "female",
    description: "Traditional auspicious black-beaded gold chain necklace with central pendant",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact mangalsutra naturally around the model's neck and draped over the upper chest.
If the model is already wearing any existing necklace, chain, or mangalsutra, COMPLETELY REMOVE, ERASE, AND REPLACE IT. Never merge or layer multiple chains or pendants. Restore clean bare skin across the décolletage and collarbones under this mangalsutra.
Preserve the exact:
- black bead pattern and gold chain links
- central pendant design, stones, and motifs
- length, proportions, and draping curve
- metalwork and finish
The mangalsutra chain must rest naturally along the neckline and collarbones.`
  },
  {
    id: "mangalsutra-earrings",
    name: "Mangalsutra with Earrings",
    placement: "neck & ears",
    gender: "female",
    description: "Matching set with auspicious mangalsutra necklace and coordinating earrings",
    suggestedAspectRatio: "4:5",
    promptInstructions: `This is a coordinated jewelry set consisting of a Mangalsutra and matching Earrings.
COMPLETELY REMOVE AND REPLACE PRE-EXISTING JEWELRY: If the model is already wearing any existing necklace, mangalsutra, chain, or earrings, completely erase and remove them all. Do not merge, layer, or double-wear. Cleanly inpaint bare skin on the neck, chest, and earlobes so the model is wearing ONLY this matching set.
1. Place the exact mangalsutra naturally around the model's neck and draped over the upper chest.
   Preserve:
   - black bead pattern and gold chain links
   - central pendant design, stones, and motifs
   - length, proportions, and draping curve
2. Place the matching earrings naturally on the model's ears.
   Preserve:
   - earring shape, stones, hanging latkans, and metalwork
   - apply the matching pair to both ears
Ensure cohesive lighting, contact shadows, and realistic perspective across both the neck and ears.`
  },
  {
    id: "full-bridal-set",
    name: "Full Bridal / All-in-One Set",
    placement: "full body / all",
    gender: "female",
    description: "Complete multi-piece jewelry suite: Necklace, Earrings, Maang Tikka, Bangles/Haath Phool, & Nath",
    suggestedAspectRatio: "4:5",
    promptInstructions: `This is a Complete Multi-Piece Luxury / Bridal Jewelry Set.
COMPLETELY REMOVE AND REPLACE PRE-EXISTING JEWELRY: If the model is currently wearing any pre-existing necklaces, earrings, maang tikka, or bangles, completely remove and erase them all. Inpaint clean bare skin across all zones before adorning the model in this new suite.
Inspect all jewelry pieces present in the product image and fit them seamlessly across all appropriate anatomical regions on the model:
1. Neck & Chest: Place the necklace, choker, and long haar with exact gemstone clusters, pendants, and layering.
2. Ears: Place the matching earrings or jhumkas naturally on both ears.
3. Forehead & Hairline: Place the maang tikka / matha patti centered along the hair parting.
4. Wrists & Hands: Place matching bangles, kadas, or haath phool if visible in the product image.
5. Nose & Face: Place the bridal nath / nose ring if visible in the product image.
Strictly preserve each piece's exact metalwork, gemstones, motifs, and finish while creating a harmonized, photorealistic bridal ensemble with realistic depth and contact shadows.`
  },

  // --- Men's Jewelry ---
  {
    id: "mens-chains",
    name: "Men's Chains & Pendants",
    placement: "neck & chest",
    gender: "male",
    description: "Gold & silver chains, curb link necklaces, rudraksha mala, & religious pendants",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact men's chain or pendant naturally around the model's neck and draped over the collarbones.
Preserve the exact:
- chain link style, thickness, and weave
- pendant design, engraving, gemstone, or religious motif
- metal shine, finish, and natural drape over the shirt, kurta, or chest
Make it rest physically against the clothing or skin with natural contact shadows.`
  },
  {
    id: "mens-kada",
    name: "Men's Kada & Bracelets",
    placement: "wrist",
    gender: "male",
    description: "Traditional heavy Punjabi kada, silver/gold wrist kada, & link bracelets",
    suggestedAspectRatio: "1:1",
    promptInstructions: `Place the exact men's kada or wrist bracelet naturally around the model's wrist.
Preserve the exact:
- kada circular profile, thickness, and cross-section
- engraved carvings, metallic polish, and finish
- natural resting position and shadow on the wrist anatomy.`
  },
  {
    id: "mens-rings",
    name: "Men's Rings & Bands",
    placement: "finger",
    gender: "male",
    description: "Signet rings, astrological gemstone rings, platinum bands, & royal signet rings",
    suggestedAspectRatio: "1:1",
    promptInstructions: `Place the exact men's ring naturally on the model's finger.
Preserve the exact:
- ring setting, band width, and gemstone cut
- engraved emblems, crests, and metalwork
Ensure realistic perspective and fit along the model's hand and finger.`
  },
  {
    id: "mens-brooch-kalgi",
    name: "Brooch & Turban Kalgi",
    placement: "chest / turban",
    gender: "male",
    description: "Royal sherwani brooch, suit lapel pins, & wedding safa/turban kalgi ornaments",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact royal brooch on the model's sherwani/suit chest lapel, or place the kalgi onto the turban/safa if present.
Preserve the exact:
- gemstone clusters, hanging pearls, and feather/filigree ornaments
- pin attachment angle and metallic luster
- natural contact against the sherwani fabric or turban.`
  },
  {
    id: "mens-kurta-buttons",
    name: "Kurta Buttons & Cufflinks",
    placement: "chest / cuffs",
    gender: "male",
    description: "Ornamental chained kurta button sets & luxury formal cufflinks",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact ornamental kurta button set along the placket of the model's kurta/sherwani, or attach cufflinks naturally to the shirt cuffs.
Preserve the exact:
- connecting chain links, enamel details, stones, and metallic finish
- aligned button spacing and physical contact shadows.`
  },
  {
    id: "mens-groom-mala",
    name: "Groom Moti Mala / Royal Haar",
    placement: "neck & chest",
    gender: "male",
    description: "Traditional multi-strand pearl mala, emerald kanthi haar, & royal groom necklaces",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact multi-strand groom moti mala or royal kanthi haar naturally draped around the model's neck over the sherwani.
Preserve the exact:
- pearl strand count, bead spacing, emerald accents, and side brooches/pendants
- natural layered draping curves across the chest and shoulders.`
  },
  {
    id: "mens-studs",
    name: "Men's Ear Studs & Bali",
    placement: "ears",
    gender: "male",
    description: "Single or paired diamond studs, gold bali earrings, & ear cuffs for men",
    suggestedAspectRatio: "4:5",
    promptInstructions: `Place the exact men's stud or bali earring naturally on the model's earlobe(s).
Preserve the exact:
- diamond facet sparkle, prong setting, and gold hoop profile
- precise placement on the earlobe without altering facial geometry.`
  }
];

export const VALID_CATEGORY_IDS = JEWELRY_CATEGORIES.map((c) => c.id);

export function getCategoryById(id: string): JewelryCategory | undefined {
  return JEWELRY_CATEGORIES.find((c) => c.id.toLowerCase() === id.toLowerCase());
}
