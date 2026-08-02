"use client";

import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry as AntdRegistryInner } from "@ant-design/nextjs-registry";

export function AntdRegistry({ children }: { children: React.ReactNode }) {
  return <AntdRegistryInner>{children}</AntdRegistryInner>;
}
