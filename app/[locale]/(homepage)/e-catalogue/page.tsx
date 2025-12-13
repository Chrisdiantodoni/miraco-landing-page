import ContactForm from "@/components/Form/RequestForm";
import Hero6 from "@/components/hero6/hero6";
import PageTitle from "@/components/PageTitle/PageTitle";
import RequestFormSection from "@/components/Section/RequestFormSection";
import { getHero } from "@/lib/api/queries/hero";
import { getLocale } from "next-intl/server";
import { Fragment } from "react/jsx-runtime";

type Props = {
  params: {
    locale: string;
    slug?: string;
  };
};
export default async function page({ params }: Props) {
  const locale = await getLocale();
  const { data } = await getHero({
    section: "e-catalogue",
    locale: locale, // 👈 Gunakan lokalitas yang diambil
  });

  console.log({ data });

  return (
    <Fragment>
      <Hero6 hero={data[0]} />

      {/* <PageTitle pagesub="Request Something from Us" /> */}
    </Fragment>
  );
}
