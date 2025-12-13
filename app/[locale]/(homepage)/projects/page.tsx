import ContactForm from "@/components/Form/RequestForm";
import Hero6 from "@/components/hero6/hero6";
import PageTitle from "@/components/PageTitle/PageTitle";
import ProjectSection from "@/components/Projects/ProjectSection";
import RequestFormSection from "@/components/Section/RequestFormSection";
import { Fragment } from "react/jsx-runtime";

export default function page() {
  return (
    <Fragment>
      {/* <Hero6 /> */}
      <PageTitle pageTitle={"Dream House Residentials"} pagesub={"Projects"} />

      <ProjectSection
        hclass={"wpo-project-section title section-padding pt-10"}
      />
    </Fragment>
  );
}
