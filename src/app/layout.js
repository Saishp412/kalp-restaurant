import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kalp | Premium Multi-Cuisine Restaurant in Airoli, Navi Mumbai',
  description: 'Experience a luxurious dining ambiance with authentic North Indian, Asian, Oriental, Korean, and Italian delicacies at Kalp in Newa Bhakti Knowledge City, Airoli.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
