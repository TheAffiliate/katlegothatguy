import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://katlegothatguy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Katlego Sebona | Junior Full-Stack Developer, Johannesburg",
  description:
    "Junior full-stack developer in Johannesburg building web and Android apps with Next.js, TypeScript, Appwrite and Java. See live projects.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Katlego Sebona | Junior Full-Stack Developer",
    description: "Live projects in healthcare, community and fintech.",
    url: siteUrl,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Katlego Sebona | Portfolio",
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: "Katlego Sebona | Junior Full-Stack Developer, Johannesburg",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Katlego Sebona",
      jobTitle: "Junior Full-Stack Developer",
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Johannesburg",
        addressCountry: "ZA",
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "IIE Rosebank College" },
      sameAs: [
        "https://github.com/TheAffiliate",
        "https://www.linkedin.com/in/katlegothatguy",
      ],
      knowsAbout: ["TypeScript", "Next.js", "Appwrite", "Java", "C#"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}