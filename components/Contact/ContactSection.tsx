/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RequestResponse } from "@/lib/types/request/request";
import React, { useState } from "react";
import { useForm, Controller, FieldValues, useWatch } from "react-hook-form";
import {
  Form,
  FormFeedback, // Digunakan untuk pesan error
  FormGroup, // Digunakan untuk membungkus label, input, dan feedback
  Input, // Komponen input dari Reactstrap
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
import SearchProduct from "../Input/SearchProduct";

const DynamicClientSelect = dynamic(() => import("../Input/ClientSelect"), {
  ssr: false,

  loading: () => (
    <Input type="select" className="form-control" disabled defaultValue="">
      <option>Loading options...</option>
    </Input>
  ), // Opsional: Tampilkan loading state
});
// Definisikan tipe input yang baru
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
      }, // Required
      phone_number: "", // Required
      instagram: "",
      address: "",
      company_name: "",
      product_requests: "",
      products: [],
    },
  });

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

  // Fields yang wajib diisi (untuk helper label)
  const requiredFields = [
    "name",
    "email",
    "region_id",
    "phone_number",
    "product_requests",
    "products",
  ];

  const onSubmit = async (data: RequestFormFields) => {
    // 1. Destructure 'data' untuk memisahkan region_id
    const { region_id, ...restOfData } = data; // region_id akan diisolasi, sisanya masuk ke restOfData

    // 2. Cari label Region berdasarkan region_id yang sudah diisolasi
    const regionLabel = regionOptions?.find(
      (find) => find?.value == region_id
    )?.label;
    const joinedProducts = Array.isArray(data.products)
      ? data.products.map((p) => p.label).join(", ")
      : "";

    // 3. Gabungkan sisa data (restOfData) dengan properti region yang baru
    const dataFormSpree = {
      ...restOfData, // Semua data kecuali region_id
      region_id,
      region: regionLabel, // Tambahkan properti 'region' dengan label yang benar
      products: joinedProducts,
    };

    mutate(dataFormSpree);
  };

  // Helper untuk label dengan bintang merah
  const getLabel = (fieldName: string, labelText: string) => (
    <Label htmlFor={fieldName}>
      {labelText}
      {requiredFields.includes(fieldName) && (
        <span className="required-star">*</span>
      )}
    </Label>
  );

  const { isPending, mutate } = useMutation({
    mutationFn: async (body: any) => {
      // console.log({ body });
      // return;
      const response = await storeRequest(body);
      return { response, body };
    },
    onSuccess: async ({ response, body }) => {
      if (response?.meta?.code == 200) {
        reset();
        toast.success("Successfully Send Request");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { region_id, ...payload } = body;
        // TIDAK menggunakan await, agar tugas ini berjalan di latar belakang
        sendFormSpreeDONI(payload).catch((err) => {
          toast.error("Failed to send Gmail");
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
            <div className="wpo-contact-title">
              <h2>Request From Us</h2>
              <p>
                Tell us what you need, and our team will get in touch shortly.
              </p>
            </div>
            <div className="wpo-contact-form-area">
              {/* Menggunakan Form dari Reactstrap dan RHF handleSubmit */}
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="contact-validation-active"
              >
                {/* 1. Name (required|string) */}
                <FormGroup>
                  {getLabel("name", "Name")}
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        id="name"
                        invalid={!!errors.name} // Set invalid jika ada error
                      />
                    )}
                  />
                  <FormFeedback>{errors.name?.message}</FormFeedback>
                </FormGroup>

                {/* 2. Email (required|email) */}
                <FormGroup>
                  {getLabel("email", "Email")}
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
                        placeholder="Email"
                        id="email"
                        invalid={!!errors.email}
                      />
                    )}
                  />
                  <FormFeedback>{errors.email?.message}</FormFeedback>
                </FormGroup>

                {/* 3. Region ID (required|string - SELECT) */}
                <FormGroup>
                  {getLabel("region_id", "Region")}
                  <Controller
                    name="region_id"
                    rules={{ required: "Region is Required" }}
                    control={control}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={regionOptions}
                        hasError={!!errors.region_id}
                        placeholder="Select Region"
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

                {/* 4. Phone Number (required) */}
                <FormGroup>
                  {getLabel("phone_number", "Phone Number")}
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{ required: "Phone number is required." }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        id="phone_number"
                        invalid={!!errors.phone_number}
                      />
                    )}
                  />
                  <FormFeedback>{errors.phone_number?.message}</FormFeedback>
                </FormGroup>

                {/* 5. Instagram (nullable) */}
                <FormGroup>
                  {getLabel("instagram", "Instagram Account")}
                  <Controller
                    name="instagram"
                    control={control}
                    // Tidak ada rules required
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Instagram (Optional)"
                        id="instagram"
                        invalid={!!errors.instagram}
                      />
                    )}
                  />
                  {/* <FormFeedback>{errors.instagram?.message}</FormFeedback> */}
                </FormGroup>

                {/* 6. Company Name (nullable) */}
                <FormGroup>
                  {getLabel("company_name", "Company Name")}
                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Company Name (Optional)"
                        id="company_name"
                        invalid={!!errors.company_name}
                      />
                    )}
                  />
                  {/* <FormFeedback>{errors.company_name?.message}</FormFeedback> */}
                </FormGroup>

                {/* 7. Address (nullable - Full Width) */}
                <FormGroup className="fullwidth">
                  {getLabel("address", "Address")}
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="textarea"
                        className="form-control"
                        placeholder="Address (Optional)"
                        id="address"
                        invalid={!!errors.address}
                      />
                    )}
                  />
                  {/* <FormFeedback>{errors.address?.message}</FormFeedback> */}
                </FormGroup>

                {/* 8. Product Requests (nullable - SELECT) */}
                <FormGroup>
                  {getLabel("product_requests", "Product Request")}
                  <Controller
                    name="product_requests"
                    control={control}
                    rules={{ required: "Product Request is Required" }}
                    render={({ field }) => (
                      <DynamicClientSelect
                        field={field}
                        options={productOptions}
                        hasError={!!errors.product_requests}
                        placeholder="Select Product"
                        isClearable={true}
                      />
                    )}
                  />
                </FormGroup>
                {productRequests === "Sample Product" && (
                  <FormGroup className="fullwidth">
                    {getLabel(
                      "products",
                      "Select Product (Just 5 Maximum allowed)"
                    )}

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
                          placeholder="Select Product"
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

                {/* Submit Area & Status Messages */}
                <div className="submit-area">
                  <button
                    type="submit"
                    className="theme-btn-s2"
                    style={{
                      border: "1px solid #000",
                    }}
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Get in Touch"}
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
