import '../styles/globals.css';

export const metadata = {
  title: 'Daily Culture Tracker',
  description: 'World news + finance + visas + culture daily digest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
