> ### NextJS codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API. This implementation uses Incremental Static Generaration (ISR) for Articles.


This codebase is created to demonstrate a simple blogging app including CRUD operations, authentication, static site generation routing, pagination, and more using [Incremental Static Regenation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) (ISR) kind of data fetching in **NextJS** and **PRISMA**.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

> Architecture | Stack
- Database : MongoDB
- ORM : PRISMA
- Backend : NextJS API pages
- Front : NextJS (React) pages

The pages (e.g. `/home` with params) are generated at build time based on expected props using [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths) but also regenerated after configured time using 
[`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) and its `revalidate` configuration property.

# Getting started

- `npm install`
- `npm run dev` (Dev server for demo and APIs required for build)
- `npm run build` (Prod build generates pages from getStaticPaths )
- `npm run start` (Starts a server from above build)
Pages can be seen statically generated and in case changes are made to data, pages would only be updated after specified time using `revalidate`