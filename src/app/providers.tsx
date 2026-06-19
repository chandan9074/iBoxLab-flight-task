"use client";

import { App, ConfigProvider } from "antd";
import type { ReactNode } from "react";

const theme = {
  token: {
    colorPrimary: "#1d40f5",
    colorInfo: "#1d40f5",
    borderRadius: 10,
    controlHeight: 40,
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
