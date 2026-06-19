"use client";

import { useState } from "react";
import {
  App,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
} from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { PriceSummary } from "./PriceSummary";
import { computePricing } from "@/lib/pricing";
import {
  isValidCardNumber,
  isValidExpiry,
} from "@/lib/booking-validation";
import type { ContactDetails, Flight, PassengerDetails } from "@/lib/types";

interface PassengerFormProps {
  flight: Flight;
  passengers: number;
  onBack: () => void;
  onSubmit: (contact: ContactDetails, passengers: PassengerDetails[]) => void;
}

interface PassengerFieldValues {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Dayjs;
}

interface FormValues {
  contact: ContactDetails;
  passengers: PassengerFieldValues[];
  payment: {
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
}

const TITLES = ["Mr", "Ms", "Mrs", "Dr"].map((t) => ({ value: t, label: t }));
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s'-]{1,}$/;

export function PassengerForm({
  flight,
  passengers,
  onBack,
  onSubmit,
}: PassengerFormProps) {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const pricing = computePricing(flight, passengers);

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const passengerDetails: PassengerDetails[] = values.passengers.map((p) => ({
      title: p.title,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      dateOfBirth: p.dateOfBirth.format("YYYY-MM-DD"),
    }));

    message.success("Booking confirmed");
    setSubmitting(false);
    onSubmit(values.contact, passengerDetails);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <div className="lg:col-span-2">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <ArrowLeftOutlined /> Back to review
        </button>

        <Form<FormValues>
          layout="vertical"
          requiredMark="optional"
          onFinish={handleFinish}
          scrollToFirstError
          initialValues={{
            passengers: Array.from({ length: passengers }, () => ({
              title: "Mr",
            })),
          }}
        >
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Contact details
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              We&apos;ll send the confirmation here.
            </p>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Form.Item
                name={["contact", "email"]}
                label="Email"
                rules={[
                  { required: true, message: "Email is required." },
                  { type: "email", message: "Enter a valid email." },
                ]}
              >
                <Input size="large" placeholder="you@example.com" />
              </Form.Item>
              <Form.Item
                name={["contact", "phone"]}
                label="Phone"
                rules={[
                  { required: true, message: "Phone is required." },
                  {
                    pattern: /^[+]?[\d\s().-]{7,}$/,
                    message: "Enter a valid phone number.",
                  },
                ]}
              >
                <Input size="large" placeholder="01XXXXXXXXX" />
              </Form.Item>
            </div>
          </section>

          {Array.from({ length: passengers }).map((_, index) => (
            <section
              key={index}
              className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
            >
              <h2 className="text-base font-semibold text-zinc-900">
                Passenger {index + 1}
              </h2>
              <Divider className="!mb-4 !mt-3" />
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-6">
                <Form.Item
                  name={["passengers", index, "title"]}
                  label="Title"
                  className="sm:col-span-1"
                  rules={[{ required: true, message: "Required." }]}
                >
                  <Select size="large" options={TITLES} />
                </Form.Item>
                <Form.Item
                  name={["passengers", index, "firstName"]}
                  label="First name"
                  className="sm:col-span-2"
                  rules={[
                    { required: true, message: "First name is required." },
                    {
                      pattern: NAME_PATTERN,
                      message: "At least 2 letters.",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Jane" />
                </Form.Item>
                <Form.Item
                  name={["passengers", index, "lastName"]}
                  label="Last name"
                  className="sm:col-span-3"
                  rules={[
                    { required: true, message: "Last name is required." },
                    {
                      pattern: NAME_PATTERN,
                      message: "At least 2 letters.",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Doe" />
                </Form.Item>
                <Form.Item
                  name={["passengers", index, "dateOfBirth"]}
                  label="Date of birth"
                  className="sm:col-span-3"
                  rules={[
                    { required: true, message: "Date of birth is required." },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="MMM D, YYYY"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                  />
                </Form.Item>
              </div>
            </section>
          ))}

          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <LockOutlined className="text-zinc-400" /> Payment
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              Demo only — do not enter a real card.
            </p>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-6">
              <Form.Item
                name={["payment", "cardName"]}
                label="Name on card"
                className="sm:col-span-3"
                rules={[{ required: true, message: "Required." }]}
              >
                <Input size="large" placeholder="Jane Doe" />
              </Form.Item>
              <Form.Item
                name={["payment", "cardNumber"]}
                label="Card number"
                className="sm:col-span-3"
                rules={[
                  { required: true, message: "Card number is required." },
                  {
                    validator: (_, value) =>
                      !value || isValidCardNumber(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error("Enter a valid card number.")),
                  },
                ]}
              >
                <Input size="large" inputMode="numeric" placeholder="4111 1111 1111 1111" />
              </Form.Item>
              <Form.Item
                name={["payment", "expiry"]}
                label="Expiry (MM/YY)"
                className="sm:col-span-3"
                rules={[
                  { required: true, message: "Required." },
                  {
                    validator: (_, value) =>
                      !value || isValidExpiry(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error("Use MM/YY, not expired.")),
                  },
                ]}
              >
                <Input size="large" placeholder="08/29" />
              </Form.Item>
              <Form.Item
                name={["payment", "cvc"]}
                label="CVC"
                className="sm:col-span-3"
                rules={[
                  { required: true, message: "Required." },
                  { pattern: /^\d{3,4}$/, message: "3–4 digits." },
                ]}
              >
                <Input size="large" inputMode="numeric" placeholder="123" />
              </Form.Item>
            </div>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting}
              className="mt-2"
              block
            >
              Pay {`& `}confirm booking
            </Button>
          </section>
        </Form>
      </div>

      <div className="lg:sticky lg:top-20">
        <PriceSummary pricing={pricing} />
        <div className="mt-3 px-1 text-xs text-zinc-500">
          Booking for {passengers} {passengers === 1 ? "passenger" : "passengers"}
          {" · "}
          {flight.origin.code}→{flight.destination.code}
        </div>
      </div>
    </div>
  );
}
