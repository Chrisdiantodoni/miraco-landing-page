import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import Hero6 from "../../components/hero6/hero6";
import ServiceSectionS6 from "@/components/Services/Service";
import PartnerSection from "@/components/Partner/PartnerSection";
import PageTitle from "@/components/PageTitle/PageTitle";
import Image from "next/image";
import CollectionSections from "@/components/Collections/CollectionSections";
import ProjectSection from "@/components/Projects/ProjectSection";

export default function Index() {
  return (
    <Fragment>
      <Hero6 />
      <ServiceSectionS6 hclass={"wpo-service-section-s6"} />
      <PartnerSection hclass={"wpo-partners-section fade_bottom"} />
      <PageTitle pageTitle="Collections" pagesub="Here is Our Collection" />
      <CollectionSections />

      <PageTitle
        pageTitle="Projects"
        pagesub="See Our Projects"
        paddingTop={100}
      />
      <ProjectSection hclass={"wpo-project-section section-padding"} />
    </Fragment>
  );
}
