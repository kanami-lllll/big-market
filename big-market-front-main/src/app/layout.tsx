import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小傅哥 - 抽奖 - 大营销平台展示',
  description: '星球「码农会锁」第8个实战项目',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
