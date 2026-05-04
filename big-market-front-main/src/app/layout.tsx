import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '郑岳桓 - 抽奖 - 大营销平台展示',
  description: '怀化学院郑岳桓制作的大营销抽奖链路展示项目',
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
