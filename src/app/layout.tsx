import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="relative font-SFPro bg-lightGray">
        <Header />
        {children}
      </body>
    </html>
  );
}
