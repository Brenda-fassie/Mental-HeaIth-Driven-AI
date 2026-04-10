import type { Metadata } from 'next'
import { Overlock, Cantarell, Amiko } from 'next/font/google'
import './globals.css'

const overlock = Overlock({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-overlock',
})

const cantarell = Cantarell({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cantarell',
})

const amiko = Amiko({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-amiko',
})

export const metadata: Metadata = {
	title: 'Rooftop',
	description: 'Mental Health Chatbot',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={`${overlock.variable} ${cantarell.variable} ${amiko.variable}`}>
			<body className="antialiased">{children}</body>
		</html>
	)
}
