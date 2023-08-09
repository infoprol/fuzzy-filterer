"use client"

import { ApolloProviderWrapper } from "./ApolloProviderWrapper"

export default function WrappedProviders({ children }: { children: React.ReactNode }) {
  return <>
  <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
  </>
}
