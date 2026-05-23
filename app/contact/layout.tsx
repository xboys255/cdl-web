import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact CDLPrepKit",
  description: "Get in touch with CDLPrepKit. Report question errors, suggest topics, or ask anything about our free CDL practice tests.",
  alternates: { canonical: "https://www.cdlprepkit.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
