import './globals.css'
import { Inter } from 'next/font/google'
import NextAuthProvider from './context/nextauthprovider.js'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Reserva de Veículos',
  description: 'Sistema de Reserva de Veículos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider></body>
    </html>
  )
}
