import React from "react";
import ContactForm from "../Form/RequestForm";

const RequestFormSection = (props: { hclass: string }) => {
  return (
    <section className={"" + props.hclass}>
      <div
        className="wraper"
        style={{ backgroundImage: `url(${"/images/contact-bg.jpg"})` }}
      >
        <div className="contact">
          <h2>Request Product</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default RequestFormSection;
