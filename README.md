# Mini Search Engine

## Description:

A web application where user can `search for anything` and `get the same results` every time.

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

## Note on implementation:

1. In real application, the server returns the correct response. So I use the mock response as is to display results without filtering for items that really contains keyword.

2. When handle clearing input by clicking clear button and select suggestion from the the suggestions dropdown, I use onMouseDown instead of onClick (because of the order in which events are fires).

- When we click on ClearButton / SuggestionItem, the `blur` event on SearchInput is triggered, which set the `isInputFocused` state to `false`
- The ClearButton / SuggestionsDropdown is applied `visibility: hidden` style. So the `click` event will not fired on those elements.
- But the `mousedown` event fires before the `blur` event. That's why I have to listen to it.
