"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import { SearchOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { AIRPORTS } from "@/data/flights";
import {
  MAX_PASSENGERS,
  MIN_PASSENGERS,
  toSearchQuery,
  validateSearch,
} from "@/lib/search-params";

interface SearchFormValues {
  origin?: string;
  destination?: string;
  date?: Dayjs;
  passengers?: number;
}

interface SearchFormProps {
  today: string;
  defaults?: Partial<{
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }>;
}

const airportOptions = AIRPORTS.map((a) => ({
  value: a.code,
  label: `${a.city} (${a.code})`,
}));

const filterByLabel = (input: string, option?: { label: string }) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export function SearchForm({ today, defaults }: SearchFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<SearchFormValues>();
  const [isPending, startTransition] = useTransition();

  function swap() {
    const { origin, destination } = form.getFieldsValue();
    form.setFieldsValue({ origin: destination, destination: origin });
  }

  function handleFinish(values: SearchFormValues) {
    const input = {
      origin: values.origin,
      destination: values.destination,
      date: values.date?.format("YYYY-MM-DD"),
      passengers: values.passengers,
    };

    const errors = validateSearch(input, today);
    if (Object.keys(errors).length > 0) {
      form.setFields(
        Object.entries(errors).map(([name, message]) => ({
          name: name as keyof SearchFormValues,
          errors: [message as string],
        })),
      );
      return;
    }

    const query = toSearchQuery({
      origin: input.origin as string,
      destination: input.destination as string,
      date: input.date as string,
      passengers: input.passengers as number,
    });
    startTransition(() => router.push(`/search?${query}`));
  }

  return (
    <div className="relative rounded-2xl bg-white p-5 shadow-xl shadow-brand-950/5 ring-1 ring-zinc-200 sm:p-6">
      <Form
        form={form}
        layout="vertical"
        // requiredMark="optional"
        onFinish={handleFinish}
        initialValues={{
          origin: defaults?.origin,
          destination: defaults?.destination,
          date: dayjs(defaults?.date ?? today),
          passengers: defaults?.passengers ?? 1,
        }}
      >
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-12 md:items-end">
          <div className="relative md:col-span-5">
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Form.Item name="origin" label="From">
                <Select
                  size="large"
                  showSearch
                  filterOption={filterByLabel}
                  placeholder="Select airport"
                  options={airportOptions}
                />
              </Form.Item>
              <Form.Item name="destination" label="To">
                <Select
                  size="large"
                  showSearch
                  filterOption={filterByLabel}
                  placeholder="Select airport"
                  options={airportOptions}
                />
              </Form.Item>
            </div>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute left-1/2 top-9 z-10 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm transition hover:text-brand-600 sm:flex"
            >
              <SwapOutlined />
            </button>
          </div>

          <Form.Item name="date" label="Depart" className="md:col-span-3">
            <DatePicker
              size="large"
              className="w-full"
              format="ddd, MMM D, YYYY"
              allowClear={false}
              disabledDate={(current) =>
                current && current < dayjs(today).startOf("day")
              }
            />
          </Form.Item>

          <Form.Item name="passengers" label="Passengers" className="md:col-span-2">
            <InputNumber
              size="large"
              className="w-full"
              min={MIN_PASSENGERS}
              max={MAX_PASSENGERS}
              precision={0}
            />
          </Form.Item>

          <Form.Item label=" " className="md:col-span-2">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isPending}
              icon={<SearchOutlined />}
              block
            >
              Search
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
