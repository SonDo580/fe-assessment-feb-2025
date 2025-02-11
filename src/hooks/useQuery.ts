import { useEffect, useState } from "react";

export function useQuery<T>({ url }: { url: string }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const response = await fetch(url + "x");
        if (!response.ok) {
          throw new Error(`Error fetching search results`);
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

/* => Improvement: accept search params, path params,... */
