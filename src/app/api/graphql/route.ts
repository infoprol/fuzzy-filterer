import { NextRequest } from 'next/server'
import { makeApolloServer } from '@/lib/apollo-misc'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

const apolloNextHandler = startServerAndCreateNextHandler(makeApolloServer())

export async function GET(request: NextRequest) {
  return apolloNextHandler(request)
}

export async function POST(request: NextRequest) {
  return apolloNextHandler(request)
}
