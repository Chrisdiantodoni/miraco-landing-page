import FavouritesList from "@/components/Dashboard/Favourites/FavouritesList";
import { AuthGuard } from "@/lib/providers/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favourites | Miraco HPL",
  description: "View your saved favourite high pressure laminate products.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavouritesPage() {
  return (
    <AuthGuard>
      <FavouritesList />
    </AuthGuard>
  );
}
