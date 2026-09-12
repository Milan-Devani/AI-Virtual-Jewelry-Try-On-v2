export const mensAttirePrompt = (style: string) => {
  switch (style) {
    case "mens-tuxedo":
      return `
- Attire Style: Bespoke Luxury Western Black-Tie Tuxedo
- Attire Specifications: Impeccably tailored midnight black or deep navy wool tuxedo with silk satin peak lapels, crisp pleated white tuxedo dress shirt, silk bow tie, and French cuffs with subtle luxury cufflinks.
- Realism: Ultra-sharp tailoring, structured shoulders, realistic wool and silk satin fabric response.
`;
    case "mens-bandhgala":
      return `
- Attire Style: Royal Indian Jodhpuri Bandhgala Suit
- Attire Specifications: Distinguished high-collar bespoke Bandhgala jacket in structured textured silk or fine velvet (charcoal, royal navy, or rich wine) featuring ornate metallic buttons and a folded pocket square.
- Realism: Clean tailored lines, rich matte textile texture, royal masculine posture.
`;
    case "mens-kurta":
      return `
- Attire Style: Luxury Royal Silk Festive Kurta
- Attire Specifications: Fluid raw silk or chanderi kurta in ivory, champagne gold, or subtle pastel with delicate tonal threadwork along the placket and collar, paired with a matching stole or churidar.
- Realism: Natural silk drape, organic fabric creases, soft high-fashion lighting.
`;
    case "mens-sherwani":
    default:
      return `
- Attire Style: Regal Royal Indian Groom Sherwani
- Attire Specifications: Opulent raw silk or brocade ivory/champagne gold Sherwani featuring intricate hand-embroidered zardozi and resham threadwork across the collar, chest, and cuffs, styled with a regal matching embroidered shawl/doshala.
- Realism: Ornate tactile metallic threading, structured royal silhouette, realistic luxury wedding photography.
`;
  }
};
