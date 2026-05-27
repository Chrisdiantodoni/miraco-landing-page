import PageTitle from "@/components/PageTitle/PageTitle";
import LocationSection from "./location";
import { getLocations } from "@/lib/api/queries/location";

export default async function LocationPage() {
  const location = await getLocations();

  return (
    <div>
      <section className="wpo-location-section">
        <div className="container">
          <PageTitle
            translation_text="locate_us_heading"
            translation_sub_text="locate_us_sub_heading"
            translations="location"
            showTopLine={false}
            paddingTop={50}
          />
          {/* <div className="location-header">
            <h1 className="location-title">Our Locations</h1>
            <p className="location-subtitle">
              Visit us at our offices around Indonesia
            </p>
          </div> */}
          <LocationSection data={location} />
        </div>
      </section>
    </div>
  );
}
