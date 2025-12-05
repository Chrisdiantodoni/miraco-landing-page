import React, { Fragment } from 'react';
import NavbarS4 from '../../components/NavbarS4/NavbarS4';
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '/public/images/logo.svg'
import error from '/public/images/error-404.png'
import Link from 'next/link';
import Image from 'next/image';

const ErrorPage = () => {
    const ClickHandler = () => {
        window.scrollTo(10,0)
    }
    return (
        <Fragment>
            <NavbarS4 hclass={'wpo-site-header wpo-header-style-s11'} Logo={Logo} col1={'col-lg-3 col-md-3 col-3 d-lg-none dl-block'}
                            col2={'col-lg-2 col-md-4 col-6'}
                            col3={'col-lg-7 col-md-1 col-1'}
                            col4={'col-lg-3 col-md-4 col-2'} />
            <PageTitle pageTitle={''} pagesub={'Contact Us'} />
            <section className="error-404-section section-padding pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12">
                            <div className="content clearfix">
                                <div className="error">
                                    <Image src={error} alt='' />
                                </div>
                                <div className="error-message">
                                    <h3>Oops! Page Not Found!</h3>
                                    <p>We’re sorry but we can’t seem to find the page you requested. This might be
                                        because
                                        you have typed the web address incorrectly.</p>
                                    <Link onClick={ClickHandler} href="/" className="theme-btn">Back to home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wpo-contact-map-section">
                <h2 className="hidden">Contact map</h2>
                <div className="wpo-contact-map">
                    <iframe title='e-map'
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.9147703055!2d-74.11976314309273!3d40.69740344223377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2sbd!4v1547528325671"
                        allowFullScreen></iframe>
                </div>
            </section>
            <Footer />
            <Scrollbar /> 
        </Fragment>
    )
};
export default ErrorPage;