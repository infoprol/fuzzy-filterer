# Makeup Search App

> This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Building and Running

1. install the dependencies:

`$ npm install`

2. To run the development server:

`$ npm run dev`

This will:

1. create the tailwind css (`src/app/output.css`)
2. run the `Next.js` development server.

Now you should be able to reach the application [here](http://localhost:3000).

> _NOTE_ there is no separate backend server. This app is divided into React Server Components and Client Components. I tried to make use of most of the features that are new as of `Next.js` version 13 (server actions, async server components, server-side rendering, etc).

> _ALSO NOTE_ that if you look in the browser's debugger, you will only see the code for client components that have been rendered on the client.

3. To create and run the production build.

`$ npm run build && npm run install`

## Behavior

### main page (`/products`)

- For the "fuzzy search", i used `fuse.js`, which is a client-side search index. That is what is driving the suggestions in the text input's dropdown.
- The dropdown will appear as soon as you start typing, narrowing down as your search text gets longer and excludes more possibilities.
- I extract all distinct tags from the sample data and use them to populate the pill-button (kinda) tags at the top of the screen. As you select these, they will filter out any product cards not having all selected tags (the tags are ANDed together, in other words). Exception to this is when no tags are selected - in that case all product cards show.

### product details page (`/products/{id}`)

- clicking on a product card will navigate to the product detail page.
- on the product detail page, the tags belonging to that particular product appear. clicking on them will navigate back to the main products page, with that tag already selected.
- in the uppor left corner of the details page, there is a link back to the /products page.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

I also used [`Framer Motion`](https://www.framer.com/motion/) to animate the Product Cards.
