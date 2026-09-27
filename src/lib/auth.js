// src/lib/auth.js

class AuthService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "https://localhost:7204";

    this.tokenKey = "auth_token";
    this.userKey = "auth_user";
  }

  // ==========================
  // LOGIN
  // ==========================
  async login(email, password) {
    const response = await fetch(
      `${this.baseUrl}/api/v1/UsuarioVisitante/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    if (!response.ok) {
      let message = "Error al iniciar sesión";

      try {
        const errorJson = await response.json();
        message = errorJson.message || message;
      } catch {}

      throw new Error(message);
    }

    const result = await response.json();
    const data = result.data;

    this.setToken(data.token);
    this.setUser(data.user);

    return data;
  }

  // ==========================
  // REGISTER
  // ==========================
  async register(data) {
    const payload = {
      Nombre: data.firstName,
      Apellido: data.lastName,
      FechaNac: data.birthDate?.format("YYYY-MM-DD"),
      Email: data.email,
      Telefono: data.phone,
      Password: data.password,
    };

    const response = await fetch(
      `${this.baseUrl}/api/v1/UsuarioVisitante/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Error al registrarse");
    }

    return await response.json();
  }

  // ==========================
  // CURRENT USER
  // ==========================
  async getCurrentUser() {
    if (!this.isAuthenticated()) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/UsuarioVisitante/me`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );

      if (!response.ok) {
        this.logout();
        return null;
      }

      const result = await response.json();

      const user = result.data?.user ?? result.data;

      this.setUser(user);

      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  // ==========================
  // TOKEN
  // ==========================
  getToken() {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) return null;

    if (!this.isAuthenticated()) {
      this.logout();
      return null;
    }

    return token;
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // ==========================
  // USER
  // ==========================
  getUser() {
    if (!this.isAuthenticated()) {
      this.logout();
      return null;
    }

    const userStr = localStorage.getItem(this.userKey);

    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      this.logout();
      return null;
    }
  }

  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // ==========================
  // ROLES
  // ==========================
  getRoles() {
    return this.getUser()?.roles ?? [];
  }

  getRole() {
    return this.getRoles()[0] ?? null;
  }

  hasRole(role) {
    return this.getRoles().includes(role);
  }

  // ==========================
  // LOGOUT
  // ==========================
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // ==========================
  // AUTH
  // ==========================
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) {
      return false;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        return false;
      }

      let payload = parts[1];

      payload = payload.replace(/-/g, "+").replace(/_/g, "/");

      while (payload.length % 4 !== 0) {
        payload += "=";
      }

      const decoded = JSON.parse(atob(payload));

      if (!decoded.exp) {
        return false;
      }

      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  // ==========================
  // FETCH AUTENTICADO
  // ==========================
  async authenticatedFetch(url, options = {}) {
    const token = this.getToken();

    const headers = {
      ...(options.headers || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.logout();

      if (window.location.pathname !== "/signIn") {
        window.location.href = "/signIn";
      }
    }

    return response;
  }
}

export const authService = new AuthService();
