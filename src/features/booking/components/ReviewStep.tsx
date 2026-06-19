"use client";

import Link from "next/link";
import { Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ItinerarySummary } from "./ItinerarySummary";
import { PriceSummary } from "./PriceSummary";
import { computePricing } from "@/lib/pricing";
import type { Flight } from "@/lib/types";

interface ReviewStepProps {
  flight: Flight;
  passengers: number;
  backToResultsHref: string;
  onContinue: () => void;
}

export function ReviewStep({
  flight,
  passengers,
  backToResultsHref,
  onContinue,
}: ReviewStepProps) {
  const pricing = computePricing(flight, passengers);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={backToResultsHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <ArrowLeftOutlined /> Back to results
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Review your flight
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Confirm the details below before adding passenger information.
            </p>
          </div>
          <ItinerarySummary flight={flight} />
        </div>

        <div className="lg:sticky lg:top-20">
          <PriceSummary
            pricing={pricing}
            action={
              <Button
                type="primary"
                size="large"
                block
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={onContinue}
              >
                Continue to passenger details
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
