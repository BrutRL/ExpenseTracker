import { url } from "./url";

export const all = async () => {
  const response = await fetch(`${url}/transaction/all`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};

export const weeklyExpenses = async () => {
  const response = await fetch(`${url}/transaction/weekly_expenses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};

export const userTransactionCount = async () => {
  const response = await fetch(`${url}/transaction/transaction_count`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};

export const userTotalExpense = async () => {
  const response = await fetch(`${url}/transaction/total_expenses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return await response.json();
};

export const create = async (body) => {
  const response = await fetch(`${url}/transaction/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return await response.json();
};
export const update = async (id, body) => {
  const response = await fetch(
    `${url}/transaction/update/${id}?_method=PATCH`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  return await response.json();
};

export const destroy = async (id) => {
  const response = await fetch(
    `${url}/transaction/delete/${id}?_method=DELETE`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return await response.json();
};
