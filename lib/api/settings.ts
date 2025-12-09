import { SiteData } from "@/lib/types/settings";

const LARAVEL_API =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

export async function fetchSiteData(): Promise<SiteData> {
  console.log({ LARAVEL_API });
  try {
    const response = await fetch(`${LARAVEL_API}/sites/settings`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Disable default cache untuk testing, tapi bisa dikasih revalidate option
      next: { revalidate: 3600 }, // Cache 1 jam
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const result = await response.json();

    // Handle response structure dari Laravel
    if (result.meta?.code === 200 && result.data) {
      return result.data;
    }

    throw new Error("Invalid response structure");
  } catch (error) {
    console.error("Settings fetch error:", error);
    // Return fallback data
    return {
      site_settings: {
        id: "",
        email_contacts: "contact@example.com",
        phone_contacts: "+62 XXX-XXXX-XXXX",
        logo_white: "",
        logo_dark: "",
        whatsapp: "",
        instagram: "",
        facebook: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        logo_white_url: "/logo-white.png",
        logo_dark_url: "/logo-dark.png",
      },
      collections: [],
    };
  }
}
