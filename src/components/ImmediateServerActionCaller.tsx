"use client";

import { startTransition, useEffect, useTransition } from "react";

/***
 * this client component simply accepts a function via its props and calls that function using the
 * useTransaction hook.
 *
 * mainly this is just to demonstrate a RSC passing down a server action to a client via props.
 * we use this to immediately redirect from the home page to /products, which is where the search
 * is.
 *
 * NOTE that there is nothing requiring callMe to actually be a server action; it could be
 * any thunk that returns void.
 *
 * to be clear, this is a rather artificial component just to demonstrate server actions.
 * of course, there are less elaborate ways to simply redirect unconditionally.
 */

function ImmediateServerActionCaller({ callMe }: { callMe: () => void }) {
  const [_, startTransaction] = useTransition();

  // we leave the deps array empty because we want this to just execute callMe()
  // once on load and that is it.
  useEffect(
    () => startTransition(() => callMe()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <></>;
}
export default ImmediateServerActionCaller;
