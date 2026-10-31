import { Plus_Jakarta_Sans, Merriweather, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import { AuthProvider } from '../context/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Unified Health Platform (Rogi Sathi)',
  description: 'Consent-based unified health platform for Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${merriweather.variable} ${sourceCodePro.variable}`}
    >
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
