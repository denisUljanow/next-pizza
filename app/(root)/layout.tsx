import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Pizza | Hauptseite",
};

export default function RootGroupLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
