type RequestHandler<P, R> = (payload: P) => Promise<R>;
interface Requests {
  getFooter: RequestHandler<{ ts: number }, { logo: string }>;
  getHeader: RequestHandler<{ noCache: boolean }, { title: string }>;
}

type ExtractFirstParameter<T> = T extends (first: infer F) => any ? F : never;

type MapRequests = {
  [K in keyof Requests]: (
    payload: ExtractFirstParameter<Requests[K]>
  ) => ReturnType<Requests[K]>;
};

function request<K extends keyof Requests>(
  key: K,
  payload: ExtractFirstParameter<Requests[K]>
): ReturnType<Requests[K]> {
  const map: MapRequests = {
    getFooter: (currentPayload) =>
      Promise.resolve({ logo: currentPayload.ts.toString() }),
    getHeader: (currentPayload) =>
      Promise.resolve({ title: currentPayload.noCache ? "" : "cached" }),
  };

  return map[key](payload);
}

(async () => {
  const headerPayload = { noCache: true };
  const headerResponse = await request("getHeader", headerPayload);
  console.log({ headerPayload, headerResponse });

  const footerPayload = { ts: 10 };
  const footerResponse = await request("getFooter", footerPayload);
  console.log({ footerPayload, footerResponse });
})();
