import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </Providers>
      </body>
    </html>
  );
}
