import ContactForm from "@/components/Form/RequestForm";
import Hero6 from "@/components/hero6/hero6";
import PageTitle from "@/components/PageTitle/PageTitle";
import ProjectSection from "@/components/Projects/ProjectSection";
import { Fragment } from "react/jsx-runtime";
import { getLocale } from "next-intl/server";
import { getHero } from "@/lib/api/queries/hero";
import { getProjects } from "@/lib/api/queries/project";
import ProjectList from "../../../../components/Projects/ProjectList";

export default async function page() {
  const locale = await getLocale();
  const { data } = await getHero({
    section: "projects",
    locale: locale, // 👈 Gunakan lokalitas yang diambi
  });

  const { data: dataProjects } = await getProjects();

  return (
    <Fragment>
      <Hero6 hero={data[0]} />
      {/* <PageTitle pageTitle={"Dream House Residentials"} pagesub={"Projects"} /> */}

      <ProjectList
        hclass={"wpo-project-section title section-padding pt-10"}
        projects={dataProjects}
      />
    </Fragment>
  );
}
