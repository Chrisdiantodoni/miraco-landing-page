import Contactpage from "@/components/Contact/ContactSection";
import ContactForm from "@/components/Form/RequestForm";
import PageTitle from "@/components/PageTitle/PageTitle";
import RequestFormSection from "@/components/Section/RequestFormSection";
import { Fragment } from "react/jsx-runtime";

export default function page() {
  return (
    <Fragment>
      {/* <PageTitle pagesub="Request Something from Us" /> */}
      {/* <RequestFormSection hclass={"wpo-consultaForm-section"} />
      <Con */}
      <Contactpage />
    </Fragment>
  );
}
