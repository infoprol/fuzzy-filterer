import React from "react"
import { Metadata } from "next"
import WrappedProviders from "@/app/WrappedProviders"

import styles from "src/styles/Home.module.css"

export const metadata: Metadata = {
  title: "FF - the Fuzzy Fiterer",
  description: "filtering fuzzily",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WrappedProviders>
          <div className={styles.mattRoot}>
            <main>
              <div>{children}</div>
              {/* Auth */}
            </main>
          </div>
        </WrappedProviders>
      </body>
    </html>
  )
}
