"use client";

import { Button, Empty, Result, Skeleton } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export function LoadingState() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading flights">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16">
      <Empty
        description={
          <div className="max-w-sm text-zinc-600">
            <p className="font-medium text-zinc-900">No flights match your search</p>
            <p className="mt-1 text-sm">
              Try a different date, route, or loosen your filters.
            </p>
          </div>
        }
      >
        {onReset && (
          <Button onClick={onReset}>Clear filters</Button>
        )}
      </Empty>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <Result
        status="error"
        title="We hit some turbulence"
        subTitle={message}
        extra={
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
