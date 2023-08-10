import { Product } from '@/lib/types'
import { NextResponse } from 'next/server'

import allProducts from '@/lib/cleaned-data.json'


const extractTags = (pp: Product[]) =>
  Object.keys(
    pp
      .reduce((acc: string[], { tags }) => [...acc, ...tags], [] as string[])
      .reduce((acc: object, elem: string) => ({ [elem]: true, ...acc }), {})
  ).sort()

const availableTags = extractTags(allProducts)



export async function GET(req: Request) {
    return NextResponse.json(availableTags)
}