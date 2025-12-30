import { defineStore } from "pinia";
import { API_URL, STORAGE_KEY_USER } from "@/config";

interface UserData {
  username: string;
  userId: string;
  token: string;
}

interface Credentials {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): UserData => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
    return {
      username: "",
      userId: "",
      token: "",
    };
  },
  actions: {
    async login(credentials: Credentials) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          let errorMessage = "Login failed";

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (errorData.code) {
              switch (errorData.code) {
                case "INCORRECT_CREDENTIALS":
                  errorMessage = "Incorrect username or password.";
                  break;
                case "INVALID_DATA":
                  errorMessage = "Invalid data.";
                  break;
                case "LOGGED_IN":
                  errorMessage = "Already logged in.";
                  break;
                default:
                  errorMessage = "An unknown error occurred.";
              }
            } else {
              errorMessage = "An error occurred during login.";
            }
          } else {
            errorMessage = "Incorrect username or password.";
          }
          throw new Error(errorMessage);
        }

        const userData = await response.json();

        this.username = userData.username;
        this.userId = userData.user_id;
        this.token = userData.token;

        localStorage.setItem(
          STORAGE_KEY_USER,
          JSON.stringify({
            username: this.username,
            userId: this.userId,
            token: this.token,
          })
        );
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    async register(credentials: Credentials) {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          let errorMessage = "Registration failed";

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (errorData.code) {
              switch (errorData.code) {
                case "INVALID_DATA":
                  errorMessage = "Invalid registration data.";
                  break;
                case "LOGGED_IN":
                  errorMessage = "You are already logged in.";
                  break;
                case "DUPLICATE_USERNAME":
                  errorMessage = "Username is already taken.";
                  break;
                default:
                  errorMessage = "An unknown error occurred.";
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else {
              errorMessage = "An error occurred during registration.";
            }
          } else {
            const errorText = await response.text();
            const plainTextError = errorText.replace(/<[^>]*>?/gm, "");
            const truncatedError = plainTextError.substring(0, 200);
            errorMessage = "Registration failed: " + truncatedError;
          }
          throw new Error(errorMessage);
        }

        const userData: UserData = await response.json();

        this.username = userData.username;
        this.userId = userData.userId;
        this.token = userData.token;

        localStorage.setItem(
          STORAGE_KEY_USER,
          JSON.stringify({
            username: this.username,
            userId: this.userId,
            token: this.token,STORAGE_KEY_USER
          })
        );
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    logout() {
      this.username = "";
      this.userId = "";
      this.token = "";

      localStorage.removeItem(STORAGE_KEY_USER);
    },
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.token,
  },
});
