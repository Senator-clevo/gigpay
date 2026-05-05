import './globals.css'

export const metadata = {
  title: 'GigPay — Get Paid. On Time. Every Time.',
  description: 'Secure escrow payments for Nigerian freelancers and gig workers.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}