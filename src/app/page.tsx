import { parseListOfTags, toQs } from '@/lib'
import { redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect'
import ImmediateServerActionCaller from '@/components/ImmediateServerActionCaller'

export default async function Home({
  searchParams: { searchText = '', tags = '' },
}: {
  searchParams: { searchText: string; tags: string }
}) {
  const activeTags = parseListOfTags(tags) || []
  const qs = toQs({ searchText, tags: activeTags })
  const toUri = `/products/?${qs}`

  async function callMe() {
    'use server'

    redirect(toUri, RedirectType.replace)
  }

  return (
    <div>
      <h3>redirecting to product search...</h3>
      <ImmediateServerActionCaller callMe={callMe} />
    </div>
  )
}
