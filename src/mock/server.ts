import { HttpResponse, http } from "msw";

import { searchEndpoint, suggestionEndpoint } from "@/services/api-endpoints";
import queryResults from "./data/queryResults.json";
import suggestionResults from "./data/suggestions.json";
import { setupServer } from "msw/node";

const handlers = [
  http.get(searchEndpoint, () => {
    return HttpResponse.json(queryResults);
  }),
  http.get(suggestionEndpoint, () => {
    return HttpResponse.json(suggestionResults);
  }),
];

export const server = setupServer(...handlers);
