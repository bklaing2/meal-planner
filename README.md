## Meal Planner

A tool to help plan your meals and generate a shopping list for the week

### Features

- Save meals with their ingredients
- Select meals to eat for the upcoming week
- The shopping list is automatically generated based on the ingredients in the meals selected for the week

### Implementation Design

The website is designed such that it can easily be hosted on [GitHub Pages](https://docs.github.com/en/pages), therefore everything needs to happen on the client. To achieve this I enabled [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode) in TanStack Start and am leveraging the [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) wrapper [Dexie.js](https://dexie.org/) for storage.


### Technology Choices

- [TanStack Start](https://github.com/tanstack/router)
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [shadcn/ui](https://github.com/shadcn-ui/ui)
- [Dexie.js](https://github.com/dexie/Dexie.js)
