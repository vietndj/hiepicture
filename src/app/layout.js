import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'HIEPICTURE — Visual Artist & Designer',
  description: 'Portfolio of HIEP — Visual Artist & Designer based in Ho Chi Minh City. Illustration, Painting, Digital Art, Brand Design.',
  keywords: ['hiepicture', 'artist', 'portfolio', 'illustration', 'design', 'vietnam'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
