export const AUTH_STORAGE_KEY = "auth";
export const AUTH_CHANGE_EVENT = "authchange";
const API_URL = "http://localhost:3000/api/auth";

const persistAuth = (data) => {
  const authData = {
    token: data.token,
    user: data.user,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  localStorage.setItem("token", data.token);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));

  return authData;
};

export const getStoredAuth = () => {
  try {
    const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return rawAuth ? JSON.parse(rawAuth) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const requestAuth = async (endpoint, payload) => {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "No fue posible completar la autenticacion");
  }

  persistAuth(data);
  return data;
};

export const signin = async (credentials) => requestAuth("signin", credentials);

export const register = async (user) => requestAuth("register", user);

export const signup = async (user) => requestAuth("signup", user);

export const signout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};
