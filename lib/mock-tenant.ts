export type Business = {
  subdomain: string;
  name: string;
  tagline: string;
  aboutText: string;
  location: string;
  yearsExperience: number;
  sessionsShot: number;
  contactEmail: string;
  contactPhone: string;
  gallery: { caption: string; category: string }[];
  packages: { title: string; description: string; price: number }[];
  reviews: { authorName: string; rating: number; body: string }[];
};

const businesses: Record<string, Business> = {
  acme: {
    subdomain: "acme",
    name: "Acme Photography",
    tagline: "Timeless portraits, real moments.",
    aboutText:
      "I'm a portrait and wedding photographer based in Springfield, working with natural light and a documentary eye. Every shoot starts with a conversation, not a checklist — so the photos actually look like you.",
    location: "Springfield, IL",
    yearsExperience: 9,
    sessionsShot: 420,
    contactEmail: "hello@acmephotography.example",
    contactPhone: "+1 (555) 019-2288",
    gallery: [
      { caption: "Golden hour portrait", category: "Portraits" },
      { caption: "First look, downtown", category: "Weddings" },
      { caption: "Studio editorial", category: "Editorial" },
      { caption: "Family in the park", category: "Family" },
      { caption: "Reception details", category: "Weddings" },
      { caption: "Senior portraits", category: "Portraits" },
    ],
    packages: [
      {
        title: "Portrait Session",
        description: "1 hour, 1 location, 25 edited digital images.",
        price: 250,
      },
      {
        title: "Family Session",
        description: "90 minutes, 2 locations, 40 edited digital images.",
        price: 375,
      },
      {
        title: "Wedding Package",
        description: "Full day coverage, two photographers, online gallery.",
        price: 2800,
      },
    ],
    reviews: [
      {
        authorName: "Morgan T.",
        rating: 5,
        body: "Made us feel so comfortable in front of the camera. The photos feel like us, not stiff and posed.",
      },
      {
        authorName: "Diego S.",
        rating: 5,
        body: "Shot our wedding and delivered the gallery faster than promised. Every shot is a keeper.",
      },
      {
        authorName: "Aisha P.",
        rating: 4,
        body: "Great eye for candid moments. Would book again for family photos.",
      },
    ],
  },
};

export function getMockBusiness(subdomain: string): Business | null {
  return businesses[subdomain] ?? null;
}
