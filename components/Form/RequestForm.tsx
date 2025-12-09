"use client";
import React, { useState } from "react";
// import SimpleReactValidator from "simple-react-validator";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    note: "",
  });

  return (
    <form className="contact-validation-active" id="consultaForm">
      <div>
        <label>Name*</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
        />
        {/* {validator.message("name", form.name, "required")} */}
      </div>
      <div>
        <label>Email*</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={form.email}
          //   onChange={handleChange}
        />
        {/* {validator.message("email", form.email, "required|email")} */}
      </div>
      <div>
        <label>Phone</label>
        <input
          type="text"
          className="form-control"
          name="phone"
          value={form.phone}
          //   onChange={handleChange}
        />
        {/* {validator.message("phone", form.phone, "numeric")} */}
      </div>
      <div>
        <label>Subject*</label>
        <select
          className="form-control"
          name="subject"
          value={form.subject}
          //   onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Subject 1">Subject 1</option>
          <option value="Subject 2">Subject 2</option>
          <option value="Subject 3">Subject 3</option>
          <option value="Subject 4">Subject 4</option>
        </select>
        {/* {validator.message("subject", form.subject, "required")} */}
      </div>
      <div className="fullwidth">
        <label>Message</label>
        <textarea
          className="form-control"
          name="note"
          value={form.note}
          //   onChange={handleChange}
        />
      </div>
      <div className="submit-area">
        <button type="submit" className="shop-btn">
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
