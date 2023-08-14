import "next/dynamic";

import React, { Suspense } from "react";
import { Metadata } from "next";
import WrappedProviders from "@/app/WrappedProviders";

import styles from "@/app/Home.module.css";
//import './globals.css'

export const metadata: Metadata = {
  title: "FF - the Fuzzy Fiterer",
  description: "filtering fuzzily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WrappedProviders>
          <div className={styles.mattRoot}>
            <main>
              <div>
                <Suspense
                  fallback={
                    <div>
                      <h2>loading..</h2>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </WrappedProviders>
      </body>
    </html>
  );
}
