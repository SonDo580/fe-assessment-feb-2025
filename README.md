# Mini Search Engine

## Description:

A web application where user can `search for anything` and `get the same results` every time.

## Live preview:

https://fe-assessment-feb-2025.vercel.app/

## Features:

- Search and display results.
- Provide search suggestions.
- Highlighting matches.
- Shareable search page link (by pushing search keyword to query string)

## Tech stack:

- React
- TypeScript
- TailwindCSS

## Setup guide:

To install and run the project locally, follow these steps:

1. Clone the repository

```bash
git clone https://github.com/SonDo580/fe-assessment-feb-2025
cd fe-assessment-feb-2025
```

2. Install dependencies

```bash
npm i
```

3. Start the application in development mode

```bash
npm run dev
```

4. Open the browser and go to http://localhost:5173

## Testing

This project use Vistest, React Testing Library, and Mock Service Worker for testing.

1. To run the tests:

```bash
npm test
```

2. To generate a test coverage report

```bash
npm run test:coverage
```

3. View the HTML report in your browser (after generation)

```bash
open coverage/index.html
```

4. Test coverage evidence
   ![Test Coverage](assets/coverage.png)

## Production build

To test the production build locally, follow these steps:

1. Build the project

```bash
npm run build
```

2. Serve the build with a local server

```bash
npm run preview
```

3. Open the browser and go to http://localhost:4173

## Extra:

The endpoints return fixed responses, so I use transform functions to mimic a `real search experience` for user.

## Note on implementation:

When handle clearing input by clicking clear button and select suggestion from the the suggestions dropdown, I use onMouseDown instead of onClick (because of the order in which events are fires).

- When we click on ClearButton / SuggestionItem, the `blur` event on SearchInput is triggered, which set the `isInputFocused` state to `false`
- The ClearButton / SuggestionsDropdown is unmounted. So the `click` event will not fired on those elements.
- But the `mousedown` event fires before the `blur` event. That's why I have to listen to it.
