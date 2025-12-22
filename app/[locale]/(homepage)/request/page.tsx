import Contactpage from "@/components/Contact/ContactSection";
import ContactForm from "@/components/Form/RequestForm";
import PageTitle from "@/components/PageTitle/PageTitle";
import { getRequestPages } from "@/lib/api/queries/request";
import { RequestResponse } from "@/lib/types/request/request";
import { Fragment } from "react/jsx-runtime";

export default async function page() {
  const data = (await getRequestPages()) as RequestResponse;
  console.log({ data });

  return (
    <Fragment>
      {/* <RequestFormSection hclass={"wpo-consultaForm-section"} />
      <Con */}
      <PageTitle
        pageTitle="Request From Us"
        pagesub="Request Something from Us"
      />

      <Contactpage data={data} />
    </Fragment>
  );
}
