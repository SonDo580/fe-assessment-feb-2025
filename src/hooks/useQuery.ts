import { useEffect, useState } from "react";

export function useQuery<T>({ url }: { url: string }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          // In real application, the server typically returns an error response
          // with some common structure. For example: 
          // {errorCode: ..., message: ...}
          //
          // We are just using a general error message here 
          throw new Error(`Error fetching data`);
        }

        const data = await response.json();
        setErrorMsg("");
        setData(data);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : String(error));
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return {
    loading,
    errorMsg,
    data,
  };
}

/**
 * Improvement: 
 * - accept search params, path params, headers, response transformer... 
 * - extend for other methods: accept method, request body,...
 */
