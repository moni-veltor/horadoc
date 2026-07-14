import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Loaded once and exposed as --font-poppins; the design tokens in
// src/core/theme.ts reference this variable.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HoraDoc — Registra tus horas",
  description: "Registra tus horas médicas y genera tus cuentas de cobro.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
