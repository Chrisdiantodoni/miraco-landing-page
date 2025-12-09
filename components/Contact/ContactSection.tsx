"use client";
import React, { useState } from "react";

const Contactpage = () => {
  const [forms, setForms] = useState({
    name: "",
    email: "",
    adress: "",
    service: "",
    note: "",
  });

  return (
    <section className="wpo-contact-pg-section section-padding pt-10">
      <div className="container">
        <div className="row">
          <div className="col col-lg-10 offset-lg-1">
            <div className="office-info">
              <div className="row">
                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                  <div className="office-info-item">
                    <div className="office-info-icon">
                      <div className="icon">
                        <i className="fi flaticon-placeholder"></i>
                      </div>
                    </div>
                    <div className="office-info-text">
                      <h2>Address</h2>
                      <p>7 Green Lake Street Crawfordsville, IN 47933</p>
                    </div>
                  </div>
                </div>
                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                  <div className="office-info-item">
                    <div className="office-info-icon">
                      <div className="icon">
                        <i className="fi flaticon-email"></i>
                      </div>
                    </div>
                    <div className="office-info-text">
                      <h2>Email Us</h2>
                      <p>bliize@gmail.com</p>
                      <p>bliize@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                  <div className="office-info-item">
                    <div className="office-info-icon">
                      <div className="icon">
                        <i className="fi flaticon-phone-call"></i>
                      </div>
                    </div>
                    <div className="office-info-text">
                      <h2>Call Now</h2>
                      <p>+1 800 123 456 789</p>
                      <p>+1 800 123 654 987</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wpo-contact-title">
              <h2>Have Any Question?</h2>
              <p>
                It is a long established fact that a reader will be distracted
                content of a page when looking.
              </p>
            </div>
            <div className="wpo-contact-form-area">
              <form className="contact-validation-active">
                <div>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={forms.name}
                    placeholder="Your Name*"
                  />
                  {/* {validator.message(
                    "name",
                    forms.name,
                    "required|alpha_space"
                  )} */}
                </div>
                <div>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={forms.email}
                    placeholder="Your Email*"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    name="adress"
                    value={forms.adress}
                    placeholder="Address"
                  />
                </div>
                <div>
                  <select
                    name="service"
                    className="form-control"
                    value={forms.service}
                  >
                    <option value="" disabled>
                      Services
                    </option>
                    <option>Subject 1</option>
                    <option>Subject 2</option>
                    <option>Subject 3</option>
                    <option>Subject 4</option>
                  </select>
                </div>
                <div className="fullwidth">
                  <textarea
                    className="form-control"
                    name="note"
                    value={forms.note}
                    placeholder="Message..."
                  />
                </div>
                <div className="submit-area">
                  <button type="submit" className="theme-btn">
                    Get in Touch
                  </button>
                  <div id="loader">
                    <i className="ti-reload"></i>
                  </div>
                </div>
                <div className="clearfix error-handling-messages">
                  <div id="success">Thank you</div>
                  <div id="error">
                    Error occurred while sending email. Please try again later.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactpage;
