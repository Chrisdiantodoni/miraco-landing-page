import Contactpage from "@/components/Contact/ContactSection";
import ContactForm from "@/components/Form/RequestForm";
import PageTitle from "@/components/PageTitle/PageTitle";
import RequestFormSection from "@/components/Section/RequestFormSection";
import { getRequestPages } from "@/lib/api/queries/request";
import { RequestResponse } from "@/lib/types/request/request";
import { Fragment } from "react/jsx-runtime";

export default async function page() {
  const data = (await getRequestPages()) as RequestResponse;
  console.log({ data });

  return (
    <Fragment>
      {/* <PageTitle pagesub="Request Something from Us" /> */}
      {/* <RequestFormSection hclass={"wpo-consultaForm-section"} />
      <Con */}
      <Contactpage data={data} />
    </Fragment>
  );
}
