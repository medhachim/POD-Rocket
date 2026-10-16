import type {Metadata} from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'POD Analytics Pro - Amazon Merch & POD Research Dashboard',
  description: 'Amazon Merch & Print-On-Demand research dashboard with BSR tracking, viral trend finder, evergreen low-competition niches, and competitor spy.',
  openGraph: {
    title: 'POD Analytics Pro - Amazon Merch & POD Research Dashboard',
    description: 'Amazon Merch & Print-On-Demand research dashboard with BSR tracking, viral trend finder, evergreen low-competition niches, and competitor spy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POD Analytics Pro - Amazon Merch & POD Research Dashboard',
    description: 'Amazon Merch & Print-On-Demand research dashboard with BSR tracking, viral trend finder, evergreen low-competition niches, and competitor spy.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}
