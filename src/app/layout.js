import './globals.css'
import NextAuthProvider from './context/nextauthprovider.js'


export const metadata = {
  title: 'Reserva de Veículos',
  description: 'Sistema de Reserva de Veículos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider></body>
    </html>
  )
}
