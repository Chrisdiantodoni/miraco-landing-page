import LoadingComponent from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";

export default function Loading() {
  <div>
    <LoadingComponent
      size="medium"
      // fullScreen={true}
      text="Memuat..."
      image={image}
      imageSize={100}
    />
  </div>;
}
