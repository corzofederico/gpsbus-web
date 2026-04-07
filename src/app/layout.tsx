/* import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css"

const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColectivosYa: Bahía Blanca",
  description: "Consulta los recorridos y paradas de colectivos de Bahía Blanca.",
  authors: [{name:"Federico Corzo",url:"https://federico.corzo.ar"}],
  icons: ["https://colectivos.corzo.ar/logo.png"],
  applicationName: "ColectivosYa"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-dvw h-dvh">
      <body className={font.className+" w-dvw h-dvh contents"}>
        {children}
      </body>
    </html>
  );
}
 */