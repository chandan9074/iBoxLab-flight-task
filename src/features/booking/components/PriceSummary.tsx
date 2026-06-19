import { formatPrice } from "@/lib/format";
import type { PriceBreakdown } from "@/lib/pricing";

interface PriceSummaryProps {
  pricing: PriceBreakdown;
  action?: React.ReactNode;
}

export function PriceSummary({ pricing, action }: PriceSummaryProps) {
  const { currency } = pricing;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-zinc-900">Price summary</h2>

      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-600">
            Base fare × {pricing.passengers}
          </dt>
          <dd className="tabular-nums text-zinc-900">
            {formatPrice(pricing.fare, currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-600">Taxes & fees</dt>
          <dd className="tabular-nums text-zinc-900">
            {formatPrice(pricing.taxes, currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="text-sm font-medium text-zinc-700">Total</span>
        <span className="text-2xl font-bold tracking-tight text-zinc-900">
          {formatPrice(pricing.total, currency)}
        </span>
      </div>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
