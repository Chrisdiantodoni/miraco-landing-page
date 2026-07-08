/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RequestResponse } from "@/lib/types/request/request";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Form } from "reactstrap";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { sendFormSpree, storeRequest } from "@/lib/api/queries/request";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import SearchProduct from "../Input/SearchProduct";

const DynamicClientSelect = dynamic(() => import("../Input/ClientSelect"), {
  ssr: false,
  loading: () => (
    <input
      type="text"
      className="form-control"
      disabled
      defaultValue="Loading options..."
    />
  ),
});

interface ContactPageProps {
  data: RequestResponse;
}

interface RequestFormFields {
  name: string;
  email: string;
  region_id: string;
  phone_number: string;
  instagram: string;
  company_name: string;
  address: string;
  product_requests: string;
  products: { label: string; value: string }[];
}

const Contactpage = ({ data }: ContactPageProps) => {
  const t = useTranslations("request");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestFormFields>({
    defaultValues: {
      name: "",
      email: "",
      region_id: "",
      phone_number: "",
      instagram: "",
      company_name: "",
      address: "",
      product_requests: "",
      products: [],
    },
  });

  const productRequests = useWatch({ control, name: "product_requests" });
  const isSampleProduct = productRequests.value === "Sample Product";

  const productOptions = data?.data?.product_requests.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const regionOptions = data?.data?.regions.map((item) => ({
    label: item?.region_name,
    value: item?.id,
  }));

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const response = await storeRequest(body);
      return { response, body };
    },
    onSuccess: async ({ response, body }) => {
      if (response?.meta?.code == 200) {
        reset();
        toast.success(t("toast_success"));
        const { region_id, ...payload } = body;
        sendFormSpree(payload).catch((err) => {
          toast.error(t("toast_error"));
          console.error("Formspree failed:", err);
        });
      }
    },
    onError: (res: any) => {
      toast.error("Failed to submit form");
    },
  });

  const onSubmit = async (data: RequestFormFields) => {
    const { region_id, ...restOfData } = data;
    const regionLabel = regionOptions?.find(
      (find) => find?.value == region_id,
    )?.label;
    const joinedProducts = Array.isArray(data.products)
      ? data.products.map((p) => p.label).join(", ")
      : "";
    console.log(region_id);
    const dataFormSpree = {
      ...restOfData,
      region_id: region_id.value,
      region: regionLabel,
      products: joinedProducts,
      product_requests: data.product_requests.value,
    };
    mutate(dataFormSpree);
  };
  const requiredDot = <span className="required-star">*</span>;

  const inputClass = (name: keyof RequestFormFields) =>
    `form-control${errors[name] ? " is-invalid" : ""}`;

  return (
    <section className="wpo-contact-pg-section section-padding pt-10">
      <div className="container">
        <div className="row">
          <div className="col col-lg-10 offset-lg-1">
            <div className="wpo-contact-form-area">
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="contact-validation-active"
              >
                {/* ---- Name ---- */}
                <div className="form-group">
                  <label htmlFor="name">
                    {t("label_name")} {requiredDot}
                  </label>
                  <input
                    {...register("name", {
                      required: t("error_name_required"),
                    })}
                    type="text"
                    className={inputClass("name")}
                    placeholder={t("placeholder_name")}
                    id="name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* ---- Email ---- */}
                <div className="form-group">
                  <label htmlFor="email">
                    {t("label_email")} {requiredDot}
                  </label>
                  <input
                    {...register("email", {
                      required: t("error_email_required"),
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: t("error_email_invalid"),
                      },
                    })}
                    type="email"
                    className={inputClass("email")}
                    placeholder={t("placeholder_email")}
                    id="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* ---- Region ---- */}
                <div className="form-group">
                  <label htmlFor="region_id">
                    {t("label_region")} {requiredDot}
                  </label>
                  <Controller
                    name="region_id"
                    control={control}
                    rules={{ required: t("error_region_required") }}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={regionOptions}
                        hasError={!!errors.region_id}
                        placeholder={t("placeholder_region")}
                        isClearable
                      />
                    )}
                  />
                  {errors.region_id && (
                    <div className="invalid-feedback">
                      {errors.region_id.message}
                    </div>
                  )}
                </div>

                {/* ---- Phone ---- */}
                <div className="form-group">
                  <label htmlFor="phone_number">
                    {t("label_phone")} {requiredDot}
                  </label>
                  <input
                    {...register("phone_number", {
                      required: t("error_phone_required"),
                    })}
                    type="text"
                    className={inputClass("phone_number")}
                    placeholder={t("placeholder_phone")}
                    id="phone_number"
                  />
                  {errors.phone_number && (
                    <div className="invalid-feedback">
                      {errors.phone_number.message}
                    </div>
                  )}
                </div>

                {/* ---- Instagram ---- */}
                <div className="form-group">
                  <label htmlFor="instagram">{t("label_instagram")}</label>
                  <input
                    {...register("instagram")}
                    type="text"
                    className={inputClass("instagram")}
                    placeholder={t("placeholder_instagram")}
                    id="instagram"
                  />
                </div>

                {/* ---- Company ---- */}
                <div className="form-group">
                  <label htmlFor="company_name">{t("label_company")}</label>
                  <input
                    {...register("company_name")}
                    type="text"
                    className={inputClass("company_name")}
                    placeholder={t("placeholder_company")}
                    id="company_name"
                  />
                </div>

                {/* ---- Address ---- */}
                <div className="form-group fullwidth">
                  <label htmlFor="address">{t("label_address")}</label>
                  <textarea
                    {...register("address")}
                    className={inputClass("address")}
                    placeholder={t("placeholder_address")}
                    id="address"
                  />
                </div>

                {/* ---- Product Request ---- */}
                <div className="form-group fullwidth">
                  <label htmlFor="product_requests">
                    {t("label_product_request")} {requiredDot}
                  </label>
                  <Controller
                    name="product_requests"
                    control={control}
                    rules={{ required: t("error_product_required") }}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={productOptions}
                        hasError={!!errors.product_requests}
                        placeholder={t("placeholder_product_request")}
                        isClearable
                      />
                    )}
                  />
                  {errors.product_requests && (
                    <div className="invalid-feedback">
                      {errors.product_requests.message}
                    </div>
                  )}
                </div>

                {/* ---- Products (conditional: Sample Product only) ---- */}
                {isSampleProduct && (
                  <div className="form-group fullwidth">
                    <label htmlFor="products">
                      {t("label_select_product")} {requiredDot}
                    </label>
                    <Controller
                      name="products"
                      control={control}
                      rules={{ required: t("error_products_required") }}
                      render={({ field }) => (
                        <SearchProduct
                          {...field}
                          options={productOptions}
                          hasError={!!errors.products}
                          placeholder={t("placeholder_select_product")}
                          isClearable
                        />
                      )}
                    />
                    {errors.products && (
                      <div className="invalid-feedback">
                        {errors.products.message}
                      </div>
                    )}
                  </div>
                )}

                {/* ---- Submit ---- */}
                <div className="submit-area">
                  <button
                    type="submit"
                    className="theme-btn-s2"
                    style={{ border: "1px solid #000" }}
                    disabled={isPending}
                  >
                    {isPending ? t("status_sending") : t("button_get_in_touch")}
                  </button>
                  <div id="loader">
                    <i className="ti-reload"></i>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactpage;

/* ================================================================
   OLD IMPLEMENTATION (kept for reference)
   ================================================================

"use client";
import { RequestResponse } from "@/lib/types/request/request";
import React, { useState } from "react";
import { useForm, Controller, FieldValues, useWatch } from "react-hook-form";
import {
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import {
  sendFormSpree,
  sendFormSpreeDONI,
  storeRequest,
} from "@/lib/api/queries/request";
import { toast } from "react-toastify";
interface ContactPageProps {
  data: RequestResponse;
}
import { useTranslations } from "next-intl";
import SearchProduct from "../Input/SearchProduct";

const DynamicClientSelect = dynamic(() => import("../Input/ClientSelect"), {
  ssr: false,

  loading: () => (
    <Input type="select" className="form-control" disabled defaultValue="">
      <option>Loading options...</option>
    </Input>
  ),
});

interface RequestFormFields extends FieldValues {
  name: string;
  email: string;
  region: string;
  phone_number: string;
  instagram: string;
  address: string;
  company_name: string;
  product_requests: string;
  banner_size: string;
  products: [{ label: string; value: string }];
}

const Contactpage = ({ data }: ContactPageProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequestFormFields>({
    defaultValues: {
      name: "",
      email: "",
      region_id: {
        label: "",
        value: "",
      },
      phone_number: "",
      instagram: "",
      address: "",
      company_name: "",
      product_requests: "",
      products: [],
    },
  });
  const t = useTranslations("request");
  const productRequests = useWatch<any>({
    control,
    name: "product_requests",
  });

  const productOptions = data?.data?.product_requests.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const regionOptions = data?.data?.regions.map((item) => ({
    label: item?.region_name,
    value: item?.id,
  }));

  const requiredFields = [
    "name",
    "email",
    "region_id",
    "phone_number",
    "product_requests",
    "products",
  ];

  const onSubmit = async (data: RequestFormFields) => {
    const { region_id, ...restOfData } = data;
    const regionLabel = regionOptions?.find(
      (find) => find?.value == region_id
    )?.label;
    const joinedProducts = Array.isArray(data.products)
      ? data.products.map((p) => p.label).join(", ")
      : "";
    const dataFormSpree = {
      ...restOfData,
      region_id,
      region: regionLabel,
      products: joinedProducts,
    };
    mutate(dataFormSpree);
  };

  const getLabel = (fieldName: string, labelText: string) => (
    <Label htmlFor={fieldName}>
      {t(labelText)}
      {requiredFields.includes(fieldName) && (
        <span className="required-star">*</span>
      )}
    </Label>
  );

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      const response = await storeRequest(body);
      return { response, body };
    },
    onSuccess: async ({ response, body }) => {
      if (response?.meta?.code == 200) {
        reset();
        toast.success(t("toast_success"));
        const { region_id, ...payload } = body;
        sendFormSpree(payload).catch((err) => {
          toast.error(t("toast_error"));
          console.error("Formspree failed:", err);
        });
      }
    },
    onError: (res: any) => {
      console.log(res);
    },
  });

  return (
    <section className="wpo-contact-pg-section section-padding pt-10">
      <div className="container">
        <div className="row">
          <div className="col col-lg-10 offset-lg-1">
            <div className="wpo-contact-form-area">
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="contact-validation-active"
              >
                <FormGroup>
                  {getLabel("name", "label_name")}
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder={t("placeholder_name")}
                        id="name"
                        invalid={!!errors.name}
                      />
                    )}
                  />
                  <FormFeedback>{errors.name?.message}</FormFeedback>
                </FormGroup>

                <FormGroup>
                  {getLabel("email", "label_email")}
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required.",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email address is invalid.",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        className="form-control"
                        placeholder={t("placeholder_email")}
                        id="email"
                        invalid={!!errors.email}
                      />
                    )}
                  />
                  <FormFeedback>{errors.email?.message}</FormFeedback>
                </FormGroup>

                <FormGroup>
                  {getLabel("region_id", "label_region")}
                  <Controller
                    name="region_id"
                    rules={{ required: "Region is Required" }}
                    control={control}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={regionOptions}
                        hasError={!!errors.region_id}
                        placeholder={t("placeholder_region")}
                        isClearable={true}
                      />
                    )}
                  />
                  {errors?.region_id && (
                    <FormFeedback style={{ display: "block" }}>
                      {errors.region_id.message as React.ReactNode}
                    </FormFeedback>
                  )}
                </FormGroup>

                <FormGroup>
                  {getLabel("phone_number", "label_phone")}
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{ required: "Phone number is required." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder={t("placeholder_phone")}
                        id="phone_number"
                        invalid={!!errors.phone_number}
                      />
                    )}
                  />
                  <FormFeedback>{errors.phone_number?.message}</FormFeedback>
                </FormGroup>

                <FormGroup>
                  {getLabel("instagram", "label_instagram")}
                  <Controller
                    name="instagram"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder={t("placeholder_instagram")}
                        id="instagram"
                        invalid={!!errors.instagram}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  {getLabel("company_name", "label_company")}
                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder={t("placeholder_company")}
                        id="company_name"
                        invalid={!!errors.company_name}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup className="fullwidth">
                  {getLabel("address", "label_address")}
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="textarea"
                        className="form-control"
                        placeholder={t("placeholder_address")}
                        id="address"
                        invalid={!!errors.address}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  {getLabel("product_requests", "label_product_request")}
                  <Controller
                    name="product_requests"
                    control={control}
                    rules={{ required: "Product Request is Required" }}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={productOptions}
                        hasError={!!errors.product_requests}
                        placeholder={t("placeholder_product_request")}
                        isClearable={true}
                      />
                    )}
                  />
                </FormGroup>
                {productRequests === "Sample Product" && (
                  <FormGroup className="fullwidth">
                    {getLabel("products", "label_select_product")}

                    <Controller
                      name="products"
                      control={control}
                      rules={{
                        required:
                          "Please specify the required product details.",
                      }}
                      render={({ field }) => (
                        <SearchProduct
                          {...field}
                          options={productOptions}
                          hasError={!!errors.products}
                          placeholder={t("placeholder_select_product")}
                          isClearable
                        />
                      )}
                    />

                    {errors?.products && (
                      <FormFeedback style={{ display: "block" }}>
                        {errors.products.message as React.ReactNode}
                      </FormFeedback>
                    )}
                  </FormGroup>
                )}

                <div className="submit-area">
                  <button
                    type="submit"
                    className="theme-btn-s2"
                    style={{
                      border: "1px solid #000",
                    }}
                    disabled={isPending}
                  >
                    {isPending ? t("status_sending") : t("button_get_in_touch")}
                  </button>
                  <div id="loader">
                    <i className="ti-reload"></i>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactpage;

   ================================================================
*/
