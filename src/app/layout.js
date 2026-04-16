import './globals.css'

export const metadata = {
  title: 'PT Palm Trade Company | Indonesian Coconut Exporter',
  description: 'PT Palm Trade Company is a trusted Indonesian coconut exporter specializing in semi husked coconut supply for Thailand, China, and India markets.',
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
} 