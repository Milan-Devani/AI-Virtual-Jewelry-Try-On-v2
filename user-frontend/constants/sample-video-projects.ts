export interface VideoProjectModelPersona {
  id: string;
  name: string;
  attire: string;
  skinTone: string;
  badge: string;
  gender: "female" | "male";
  avatarUrl: string;
  description: string;
}

export interface VideoProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryName: string;
  aspectRatio: "9:16" | "4:5" | "16:9";
  durationSeconds: number;
  motionStyle: "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose" | "ugc-cinematic";
  sourceJewelryUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  modelPersona: VideoProjectModelPersona;
  highlights: string[];
  prompt: string;
  tags: string[];
}

export const FASHION_VIDEO_MODELS: VideoProjectModelPersona[] = [
  {
    id: "gujarati-bridal",
    name: "Aanya Patel",
    attire: "Gujarati Panetar & Gharchola with pure gold zari borders & Bandhani silk",
    skinTone: "Wheatish / Warm Olive",
    badge: "Gujarat Bridal",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    description: "Traditional Gujarati royal bridal styling, graceful head tilt, elegant regal composure.",
  },
  {
    id: "south-indian-temple",
    name: "Meera Krishnan",
    attire: "South Indian Kanjeevaram Silk with temple gold zari and fresh jasmine gajra",
    skinTone: "Dusky / Sun-Kissed Honey",
    badge: "South Indian Temple",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    description: "Classical Bharatanatyam posture, opulent temple motifs, serene eye expressions.",
  },
  {
    id: "rajputi-poshak",
    name: "Padmini Rathore",
    attire: "Rajasthani Marwari Rajputi Poshak with heavy Gota Patti and sheer odhni",
    skinTone: "Fair / Warm Undertone",
    badge: "Royal Rajputi",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    description: "Jaipur royal lineage aesthetic, dignified chin elevation, soft architectural background.",
  },
  {
    id: "western-couture",
    name: "Elena Rostova",
    attire: "Western Haute Couture Décolleté Black-Tie Silk Satin Evening Gown",
    skinTone: "Fair / Porcelain",
    badge: "Western Couture",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    description: "Paris Fashion Week editorial pacing, 35mm shallow focus, sleek minimalist silhouette.",
  },
  {
    id: "punjabi-lehenga",
    name: "Simran Kaur",
    attire: "Heavily embroidered Crimson Bridal Lehenga Choli with Zardozi & Gotta Patti",
    skinTone: "Fair / Radiant Rose",
    badge: "Punjabi Royal",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    description: "Vibrant high-fashion celebratory motion, floral backdrop, gleaming gold caustics.",
  },
  {
    id: "royal-groom",
    name: "Devrath Singh",
    attire: "Royal Raw Silk Ivory Sherwani with Ornate Gold Placket & Wedding Safa",
    skinTone: "Wheatish / Warm Olive",
    badge: "Royal Groom",
    gender: "male",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    description: "Commanding male royal presence, sculpted jawline, dignified pacing and posture.",
  },
];

export const REAL_VIDEO_PROJECTS: VideoProject[] = [
  {
    id: "proj-royal-kundan-necklace",
    title: "Royal Heritage Kundan & Emerald Haar Campaign",
    subtitle: "18s Luxury Editorial Commercial • 60 FPS 1080p",
    category: "necklaces-pendants",
    categoryName: "Necklaces & Pendants",
    aspectRatio: "9:16",
    durationSeconds: 18,
    motionStyle: "head-turn",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-wearing-a-gold-necklace-41489-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[0],
    highlights: [
      "100% exact Kundan stone count & green emerald drop preservation",
      "5-stage walk progression with slow push-in toward pendant",
      "Macro caustics highlighting 22k gold foil craftsmanship",
      "Soft natural studio lighting with zero CGI bloom",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (18s duration) using the uploaded Kundan necklace image as the EXACT REFERENCE PRODUCT.
The model (Aanya Patel in Gujarati Panetar) slowly walks toward the camera with confident, natural movement.
Camera smoothly tracks in: opening medium fashion shot -> slow push-in to chest -> macro extreme close-up of emerald drops -> hero shot ending.
Ray-traced physical caustics, soft prismatic sparkles, 35mm lens depth of field, 60fps luxury editorial master.`,
    tags: ["Kundan", "Bridal", "Emerald", "Reels 9:16", "Panetar"],
  },
  {
    id: "proj-temple-gold-jhumkas",
    title: "Traditional South Indian Temple Bell Jhumkas",
    subtitle: "15s High-Fashion Runway Campaign • 2K Portrait",
    category: "jhumkas",
    categoryName: "Jhumkas",
    aspectRatio: "4:5",
    durationSeconds: 15,
    motionStyle: "editorial-smile",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-wearing-a-pair-of-sparkling-earrings-41488-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[1],
    highlights: [
      "Exact bell shape, ruby cabochons & hanging pearl latkans intact",
      "3/4 face profile angle with natural swing on gentle head movement",
      "South Indian Kanjeevaram silk background separation",
      "Zero warping, zero duplicate earrings, photorealistic 60fps",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (15s duration) using the uploaded Jhumka earrings image as the EXACT REFERENCE PRODUCT.
JEWELRY FOCUS (Jhumkas): Show the model's face and ear from a 3/4 angle. Allow the jhumka to move naturally with subtle head movement.
Capture a close-up showing the bell shape, hanging latkan elements, stones, and intricate filigree details.
Meera Krishnan in Kanjeevaram silk, soft studio key/fill lighting, 35mm lens, natural skin texture with real pores.`,
    tags: ["Jhumkas", "Temple Gold", "South Indian", "4:5 Feed", "Ruby & Pearls"],
  },
  {
    id: "proj-diamond-solitaire-ring",
    title: "Parisian Solitaire Diamond Ring Showcase",
    subtitle: "15s Macro Haute Couture Film • 16:9 Landscape",
    category: "rings",
    categoryName: "Rings",
    aspectRatio: "16:9",
    durationSeconds: 15,
    motionStyle: "subtle-sparkle",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-an-engagement-ring-41490-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[3],
    highlights: [
      "Flawless 3.5-carat round brilliant diamond cut facet preservation",
      "Natural hand gesture with elegant slow finger movement",
      "Physical ray-traced fire and scintillation under soft studio spotlight",
      "Minimalist black velvet editorial backdrop",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (15s duration) using the uploaded diamond ring image as the EXACT REFERENCE PRODUCT.
JEWELRY FOCUS (Rings): Naturally position the ring on the model's finger. Include natural hand movement, capturing a macro close-up of the center gemstone facets, setting, and platinum band.
Elena Rostova in Haute Couture black-tie silk evening gown, 35mm shallow focus, pristine reflections.`,
    tags: ["Solitaire", "Diamond", "Haute Couture", "16:9 Landscape", "Platinum"],
  },
  {
    id: "proj-rajputi-haath-phool",
    title: "Heritage Royal Rajputi Gota Haath Phool",
    subtitle: "20s Full Editorial Runway • 9:16 Social Reel",
    category: "haath-phool",
    categoryName: "Haath Phool",
    aspectRatio: "9:16",
    durationSeconds: 20,
    motionStyle: "runway-pose",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1611591477281-420bf845659c?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-wearing-a-gold-bracelet-41492-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611591477281-420bf845659c?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[2],
    highlights: [
      "Physical connection between wrist kada, chains, and 3 finger rings preserved",
      "Subtle graceful hand movement revealing intricate Kundan flower center",
      "Warm ambient palace lighting with golden hour natural warmth",
      "2-3s hero close-up ending suitable for Instagram Reels & TikTok",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (20s duration) using the uploaded Haath Phool image as the EXACT REFERENCE PRODUCT.
JEWELRY FOCUS (Haath Phool): Show natural hand movement. Clearly show the physical connection between wrist bracelet, fingers, and decorative joining chains. Include a detailed macro shot of the hand jewelry.
Padmini Rathore in Rajasthani Rajputi Poshak, natural breathing, zero jewelry distortion, 60fps cinematic luxury master.`,
    tags: ["Haath Phool", "Rajputi", "Kada & Rings", "9:16 Reel", "Royal Marwari"],
  },
  {
    id: "proj-polki-maang-tikka",
    title: "Regal Polki & Pearl Bridal Maang Tikka",
    subtitle: "18s Bridal Centerpiece Campaign • 9:16 Reel",
    category: "maang-tikka",
    categoryName: "Maang Tikka",
    aspectRatio: "9:16",
    durationSeconds: 18,
    motionStyle: "editorial-smile",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-wearing-traditional-jewelry-and-attire-41495-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[4],
    highlights: [
      "Uncut diamond Polki cluster centered on hair parting",
      "Frontal and slightly above eye-level camera choreography",
      "Soft eye contact, serene confident smile, genuine eyelashes & pores",
      "Pristine pearl drops swaying gently with natural breathing",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (18s duration) using the uploaded Maang Tikka image as the EXACT REFERENCE PRODUCT.
JEWELRY FOCUS (Maang Tikka): Show the model from the front and slightly above eye level. Keep the maang tikka centered naturally on the forehead along the hair parting. Include a close-up showing its pendant, chain, and stones.
Simran Kaur in bridal lehenga, softbox key light, realistic skin illumination, anti-CGI filters.`,
    tags: ["Maang Tikka", "Polki", "Bridal Hair", "9:16", "Punjabi Lehenga"],
  },
  {
    id: "proj-royal-groom-mala",
    title: "Heritage Groom Multi-Strand Moti Mala",
    subtitle: "15s Royal Groom Commercial • 4:5 Feed",
    category: "mens-groom-mala",
    categoryName: "Men's Groom Mala",
    aspectRatio: "4:5",
    durationSeconds: 15,
    motionStyle: "head-turn",
    sourceJewelryUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-elegant-groom-in-a-sherwani-wearing-royal-jewelry-41496-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    modelPersona: FASHION_VIDEO_MODELS[5],
    highlights: [
      "Multi-strand natural pearl luster draped naturally over ivory sherwani",
      "Dignified walking posture with confident male model presence",
      "Emerald & gold pendant catching warm architectural lighting",
      "100% natural fabric texture, sharp collarbone draping",
    ],
    prompt: `Create a photorealistic luxury jewelry fashion campaign video (15s duration) using the uploaded Groom Mala image as the EXACT REFERENCE PRODUCT.
Male model Devrath Singh in Royal Ivory Sherwani walking slowly with confident posture.
Camera pushes in toward the multi-strand pearl mala and pendant, capturing micro reflections on pearls and gold settings.
35mm lens, natural shadows, physically believable motion, zero deformation.`,
    tags: ["Groom Mala", "Sherwani", "Men's Luxury", "4:5", "Pearls & Emerald"],
  },
];
