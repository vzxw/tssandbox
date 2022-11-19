///////////////////////////////// request definitions ////////////////////////
type MakeRequest<ID extends string, PAYLOAD, RESPONSE> = {
  id: ID;
  payload: PAYLOAD;
  response: RESPONSE;
};

type RequestUnion =
  | MakeRequest<"request-footer", { ts: number }, { homeUrl: string }>
  | MakeRequest<"request-header", { noCache: boolean }, { logoUrl: string }>;

///////////////////////////////// util types /////////////////////////////////
export type DiscriminateUnion<
  T,
  K extends keyof T,
  V extends T[K]
> = T extends Record<K, V> ? T : never;
type MapRequests = {
  [V in RequestUnion["id"]]: (
    payload: DiscriminateUnion<RequestUnion, "id", V>["payload"]
  ) => Promise<DiscriminateUnion<RequestUnion, "id", V>["response"]>;
};

///////////////////////////////// client implementation //////////////////////
function request<T extends RequestUnion, K extends T["id"]>(
  id: K,
  payload: DiscriminateUnion<T, "id", K>["payload"]
): Promise<DiscriminateUnion<T, "id", K>["response"]> {
  const map: MapRequests = {
    "request-footer": (payload) =>
      Promise.resolve({ homeUrl: JSON.stringify(payload) }),
    "request-header": (payload) =>
      Promise.resolve({ logoUrl: JSON.stringify(payload) }),
  };

  return map[id](payload as never); // hack
}

(async () => {
  const headerPayload = { noCache: true };
  const headerResponse = await request("request-header", headerPayload);
  console.log({ headerPayload, headerResponse });

  const footerPayload = { ts: 10 };
  const footerResponse = await request("request-footer", footerPayload);
  console.log({ footerPayload, footerResponse });
})();
