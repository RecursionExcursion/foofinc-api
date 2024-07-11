export type Header = Record<string, string>;

export type HateoasLink = {
    href: string;
    rel: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
  };