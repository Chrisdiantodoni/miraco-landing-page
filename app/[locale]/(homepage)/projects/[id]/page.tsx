// "use client";
import ContactForm from "@/components/Form/RequestForm";
import Hero6 from "@/components/hero6/hero6";
import PageTitle from "@/components/PageTitle/PageTitle";

import { Fragment } from "react/jsx-runtime";

import ProjectDetail from "./project-detail";
import { getProjectById } from "@/lib/api/queries/project";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await getProjectById(id);
  return (
    <Fragment>
      {/* <PageTitle pageTitle={data?.project_name} pagesub={"Service Single"} /> */}
      <ProjectDetail project={data} />
    </Fragment>
  );
}
