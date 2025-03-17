import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { server } from "@/mock/server";
import queryResults from "@/mock/data/queryResults.json";
import { searchEndpoint } from "@/services/api-endpoints";
import { useQuery } from "./useQuery";

describe("useQuery hook", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  it("should fetch and return data correctly", async () => {
    const url = searchEndpoint;
    const { result } = renderHook(() => useQuery({ url }));

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toStrictEqual(queryResults);
    expect(result.current.errorMsg).toBe("");
  });

  it("should apply transform function to the fetched data", async () => {
    const url = searchEndpoint;

    // example
    const transformResponseFn = (data: typeof queryResults) => ({
      ...data,
      TotalNumberOfResults: data.TotalNumberOfResults * 2,
    });

    const { result } = renderHook(() => useQuery({ url, transformResponseFn }));

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMsg).toBe("");
    expect(result.current.data).toStrictEqual({
      ...queryResults,
      TotalNumberOfResults: queryResults.TotalNumberOfResults * 2,
    });
  });

  it("should not make request if url is empty", async () => {
    const { result } = renderHook(() => useQuery({ url: "" }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.errorMsg).toBe("");
  });

  it("should handle error correctly", async () => {
    server.use(
      http.get(searchEndpoint, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const url = searchEndpoint;
    const { result } = renderHook(() => useQuery({ url }));

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.errorMsg).not.toBe("");
  });
});
