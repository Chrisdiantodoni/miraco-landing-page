/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meta } from "@/lib/types";
import { LocationListResponse } from "@/lib/types/location/location";
import { MapPin, PhoneCall, Navigation } from "lucide-react";
import Image from "next/image";
interface Location {
  id: string;
  name_company: string;
  address: string;
  contacts: string;
  image?: string | null;
  image_url?: string | null;
  lat?: string | null;
  long?: string | null;
  order?: number;
  link_google_maps: string;
}
interface locationSectionProps {
  data: {
    meta: Meta;
    data: Location[];
  };
}

export default function LocationSection({ data }: locationSectionProps | any) {
  const AllLocations: Location[] = data?.data;
  console.log({ AllLocations });

  return (
    <div className="location-grid">
      {AllLocations.map((location) => (
        <div
          key={location?.id}
          className={`location-card ${!location.image_url ? "no-image" : ""}`}
        >
          {/* Image */}

          {/* Content */}
          <div className="location-content">
            <h2 className="location-company-name">{location.name_company}</h2>

            {/* Address */}
            <div className="location-info">
              <MapPin />
              <p className="location-text">{location.address}</p>
            </div>

            {/* Contacts */}
            <div className="location-info">
              <PhoneCall />
              <p className="location-text">{location.contacts}</p>
            </div>

            {/* Google Maps Button */}
            {location.link_google_maps && (location?.lat || location?.long) && (
              <a
                href={location.link_google_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="location-button"
              >
                <Navigation />
                View on Google Maps
              </a>
            )}
          </div>
          {location.image_url && (
            <div className="location-image-wrapper">
              <Image
                width={300}
                height={300}
                src={location?.image_url}
                className="location-image"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                alt={`${location?.name_company} - foto`}
              />
              {/* <img
                src={location.image_url}
                alt={location.name_company}
                className="location-image"
              /> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
