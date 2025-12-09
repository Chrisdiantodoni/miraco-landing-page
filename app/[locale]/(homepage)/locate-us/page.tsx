import PageTitle from "@/components/PageTitle/PageTitle";

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

// Sample data
const locations: Location[] = [
  {
    id: "1",
    name_company: "Jakarta Office",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    contacts: "+62-21-5555-1234 | info@company.com",
    lat: "-6.2087",
    long: "106.8456",
    link_google_maps: "https://maps.google.com",
  },
  {
    id: "2",
    name_company: "Bandung Office",
    address: "Jl. Gatot Subroto No. 456, Bandung",
    contacts: "+62-274-555-5678 | bandung@company.com",
    image_url: "https://via.placeholder.com/300x200?text=Bandung+Office",
    lat: "-6.9147",
    long: "107.6098",
    link_google_maps: "https://maps.google.com",
  },
  {
    id: "3",
    name_company: "Medan Office",
    address: "Jl. Diponegoro No. 789, Medan",
    contacts: "+62-61-555-9012 | medan@company.com",
    image_url: "https://via.placeholder.com/300x200?text=Medan+Office",
    lat: "3.1952",
    long: "98.6722",
    link_google_maps: "https://maps.google.com",
  },
];

export default function LocationPage() {
  return (
    <div>
      <section className="wpo-location-section">
        <div className="container">
          <PageTitle
            pageTitle="Locate Us"
            pagesub="Visit us at our offices around Indonesia"
            paddingTop={0}
          />
          {/* <div className="location-header">
            <h1 className="location-title">Our Locations</h1>
            <p className="location-subtitle">
              Visit us at our offices around Indonesia
            </p>
          </div> */}

          <div className="location-grid">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`location-card ${
                  !location.image_url ? "no-image" : ""
                }`}
              >
                {/* Image */}
                {location.image_url && (
                  <div className="location-image-wrapper">
                    <img
                      src={location.image_url}
                      alt={location.name_company}
                      className="location-image"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="location-content">
                  <h2 className="location-company-name">
                    {location.name_company}
                  </h2>

                  {/* Address */}
                  <div className="location-info">
                    <i className="fi-rr-marker"></i>
                    <p className="location-text">{location.address}</p>
                  </div>

                  {/* Contacts */}
                  <div className="location-info">
                    <i className="fi-rr-phone-call"></i>
                    <p className="location-text">{location.contacts}</p>
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={location.link_google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-button"
                  >
                    <i className="fi-rr-navigation"></i>
                    View on Google Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
