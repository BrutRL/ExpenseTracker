import { url } from "./url";

export const specific = async () => {
  const response = await fetch(`${url}/user/specific`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};
export const update = async (body) => {
  const response = await fetch(`${url}/user/update/?_method=PATCH`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return await response.json();
};
