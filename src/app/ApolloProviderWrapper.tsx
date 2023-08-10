"use client";

import { makeApolloClient } from '@/lib'
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeApolloClient}>
      {children}
    </ApolloNextAppProvider>
  );
}