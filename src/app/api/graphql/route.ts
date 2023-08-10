import { apolloNextHandler } from "@/lib"
import { NextRequest } from "next/server"




export async function GET(request: NextRequest) {

  return apolloNextHandler(request)
}

export async function POST(request: NextRequest) {
  console.log(`handling post with apollo`)
  return apolloNextHandler(request)
}