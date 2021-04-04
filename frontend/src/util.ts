import { Color, ColorId } from "./models";

export function resolveColor(colorId: ColorId, colors: Array<Color>) {
  return colors.find((c) => c.id === colorId)?.color;
}

const httpHeaders = {
  "Content-type": "application/json",
  Accept: "application/json",
};

export function apiCall(url: string, method: string = "GET", payload?: Object) {
  const options: RequestInit = {
    method,
    headers: httpHeaders,
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }

  return fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error("Server error");
    } else {
      return res.json();
    }
  });
}
