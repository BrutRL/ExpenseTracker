import { url } from "./url.js";

export const login = async (body) => {
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  return await response.json();
};
export const register = async (body) => {
  const response = await fetch(`${url}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const logout = async (body) => {
  const response = await fetch(`${url}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  return await response.json();
};

export const authorized = async () => {
  const response = await fetch(`${url}/auth/authorized`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};
