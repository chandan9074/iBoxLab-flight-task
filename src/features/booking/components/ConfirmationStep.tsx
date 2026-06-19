"use client";

import Link from "next/link";
import { Button, Result } from "antd";
import { HomeOutlined, PrinterOutlined } from "@ant-design/icons";
import { ItinerarySummary } from "./ItinerarySummary";
import { PriceSummary } from "./PriceSummary";
import { computePricing } from "@/lib/pricing";
import { formatDateLong } from "@/lib/date";
import type { BookingConfirmation } from "@/lib/types";

export function ConfirmationStep({
  confirmation,
}: {
  confirmation: BookingConfirmation;
}) {
  const { flight, contact, passengers, reference, createdAt } = confirmation;
  const pricing = computePricing(flight, passengers.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <Result
          status="success"
          title="Your booking is confirmed"
          subTitle={
            <span>
              Confirmation reference{" "}
              <span className="font-mono font-semibold text-zinc-900">
                {reference}
              </span>{" "}
              · A receipt was sent to {contact.email}
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ItinerarySummary flight={flight} />

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Passengers
            </h2>
            <ul className="mt-3 divide-y divide-zinc-100">
              {passengers.map((p, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="font-medium text-zinc-900">
                    {p.title} {p.firstName} {p.lastName}
                  </span>
                  <span className="text-zinc-500">
                    Born {formatDateLong(p.dateOfBirth + "T00:00:00.000Z")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PriceSummary pricing={pricing} />
          <div className="flex flex-col gap-2">
            <Button
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
              block
            >
              Print confirmation
            </Button>
            <Link href="/">
              <Button type="primary" icon={<HomeOutlined />} block>
                Book another flight
              </Button>
            </Link>
          </div>
          <p className="px-1 text-xs text-zinc-400">
            Booked {formatDateLong(createdAt)} · Demo booking, not a real ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
