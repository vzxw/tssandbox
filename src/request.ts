///////////////////////////////// request definitions ////////////////////////
interface RequestFooter {
  id: "request-footer";
  payload: { ts: number };
  response: { homeUrl: string };
}
interface RequestHeader {
  id: "request-header";
  payload: { noCache: boolean };
  response: { logoUrl: string };
}
type RequestUnion = RequestFooter | RequestHeader;

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
  payload: DiscriminateUnion<T, "id", T["id"]>["payload"]
): Promise<DiscriminateUnion<T, "id", T["id"]>["response"]> {
  const map: MapRequests = {
    "request-footer": (payload) =>
      Promise.resolve({ homeUrl: JSON.stringify(payload) }),
    "request-header": (payload) =>
      Promise.resolve({ logoUrl: JSON.stringify(payload) }),
  };

  const handler = map[id];
  return handler(payload);
}

(async () => {
  const headerPayload = { ts: 10 };
  const headerResponse = await request("request-header", headerPayload);
  console.log({ headerPayload, headerResponse });

  const footerPayload = { ts: 10 };
  const footerResponse = await request("request-footer", headerPayload);
  console.log({ footerPayload, footerResponse });
})();
