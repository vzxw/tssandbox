///////////////////////////////// request definitions ////////////////////////
type MakeRequestUtil<ID extends string, PAYLOAD, RESPONSE> = {
  id: ID;
  payload: PAYLOAD;
  response: RESPONSE;
};

type RequestUnion =
  | MakeRequestUtil<"request-footer", { ts: number }, { homeUrl: string }>
  | MakeRequestUtil<
      "request-header",
      { noCache: boolean },
      { logoUrl: string }
    >;

///////////////////////////////// util types /////////////////////////////////
type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<
  K,
  V
>
  ? T
  : never;

type MapRequstsType = {
  [V in RequestUnion["id"]]: (
    payload: DiscriminateUnion<RequestUnion, "id", V>["payload"]
  ) => Promise<DiscriminateUnion<RequestUnion, "id", V>["response"]>;
};

///////////////////////////////// client implementation //////////////////////
function requestA<T extends RequestUnion, K extends T["id"]>(
  id: K,
  payload: DiscriminateUnion<T, "id", K>["payload"]
): Promise<DiscriminateUnion<T, "id", K>["response"]> {
  const map: MapRequstsType = {
    "request-footer": (payload) =>
      Promise.resolve({ homeUrl: JSON.stringify(payload) }),
    "request-header": (payload) =>
      Promise.resolve({ logoUrl: JSON.stringify(payload) }),
  };

  return map[id](payload as never); // hack
}

(async () => {
  const headerPayload = { noCache: true };
  const headerResponse = await requestA("request-header", headerPayload);
  console.log({ headerPayload, headerResponse });

  const footerPayload = { ts: 10 };
  const footerResponse = await requestA("request-footer", footerPayload);
  console.log({ footerPayload, footerResponse });
})();
