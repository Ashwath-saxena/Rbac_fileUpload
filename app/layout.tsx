import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RBAC App',
  description: 'Role Based Access Control Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen bg-gray-100">
            {children}
            <Toaster position="top-center" />
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}