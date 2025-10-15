export const login = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/auth/login";
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

export const getUserId = () => {
  const user = getUser();
  return user ? user.id : null;
};
