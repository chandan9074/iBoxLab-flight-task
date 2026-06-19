"use client";

import { useState } from "react";
import { Steps } from "antd";
import { ReviewStep } from "./ReviewStep";
import { PassengerForm } from "./PassengerForm";
import { ConfirmationStep } from "./ConfirmationStep";
import { generateBookingReference } from "@/lib/booking-validation";
import type {
  BookingConfirmation,
  ContactDetails,
  Flight,
  PassengerDetails,
} from "@/lib/types";

interface BookingFlowProps {
  flight: Flight;
  passengers: number;
  backToResultsHref: string;
}

type StepIndex = 0 | 1 | 2;

export function BookingFlow({
  flight,
  passengers,
  backToResultsHref,
}: BookingFlowProps) {
  const [step, setStep] = useState<StepIndex>(0);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  );

  function handleBookingSubmit(
    contact: ContactDetails,
    passengerDetails: PassengerDetails[],
  ) {
    setConfirmation({
      reference: generateBookingReference(),
      createdAt: new Date().toISOString(),
      flight,
      contact,
      passengers: passengerDetails,
    });
    setStep(2);
  }

  return (
    <div className="flex flex-col gap-8">
      <Steps
        current={step}
        responsive
        items={[
          { title: "Review" },
          { title: "Passenger details" },
          { title: "Confirmation" },
        ]}
      />

      {step === 0 && (
        <ReviewStep
          flight={flight}
          passengers={passengers}
          backToResultsHref={backToResultsHref}
          onContinue={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <PassengerForm
          flight={flight}
          passengers={passengers}
          onBack={() => setStep(0)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {step === 2 && confirmation && (
        <ConfirmationStep confirmation={confirmation} />
      )}
    </div>
  );
}
