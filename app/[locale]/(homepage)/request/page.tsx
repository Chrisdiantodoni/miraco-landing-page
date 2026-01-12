import Contactpage from "@/components/Contact/ContactSection";
import ContactForm from "@/components/Form/RequestForm";
import PageTitle from "@/components/PageTitle/PageTitle";
import { getRequestPages } from "@/lib/api/queries/request";
import { RequestResponse } from "@/lib/types/request/request";
import { Fragment } from "react/jsx-runtime";

export default async function page() {
  const data = (await getRequestPages()) as RequestResponse;

  return (
    <Fragment>
      {/* <RequestFormSection hclass={"wpo-consultaForm-section"} />
      <Con */}
      <PageTitle
        translation_text="request_heading"
        translation_sub_text="request_sub_heading"
        translations="request"
        showTopLine={false}
        paddingTop={50}
      />

      <Contactpage data={data} />
    </Fragment>
  );
}
