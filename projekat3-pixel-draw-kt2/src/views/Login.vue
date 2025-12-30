<template>
  <div
    class="min-h-fit flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin" novalidate>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              minlength="2"
              maxlength="32"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
            />
            <p v-if="usernameError" class="text-red-500 text-sm mt-1">
              {{ usernameError }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              minlength="8"
              maxlength="128"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

const authStore = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const usernameError = ref("");
const passwordError = ref("");

const validateUsername = (): boolean => {
  usernameError.value = "";
  if (!username.value) {
    usernameError.value = "Username is required.";
    return false;
  }
  if (username.value.length < 2) {
    usernameError.value = "Username must be at least 2 characters.";
    return false;
  }
  if (username.value.length > 32) {
    usernameError.value = "Username must be less than 32 characters.";
    return false;
  }
  return true;
};

const validatePassword = (): boolean => {
  passwordError.value = "";
  if (!password.value) {
    passwordError.value = "Password is required.";
    return false;
  }
  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters.";
    return false;
  }
  if (password.value.length > 128) {
    passwordError.value = "Password must be less than 128 characters.";
    return false;
  }
  return true;
};

const handleLogin = async () => {
  errorMessage.value = "";

  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {
    return;
  }

  try {
    const credentials = {
      username: username.value,
      password: password.value,
    };

    await authStore.login(credentials);

    router.push("/draw");
    toast.success("Successful login");
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error("Incorrect credentials");

    errorMessage.value =
      error.message || "Login failed. Please try again later.";
  }
};
</script>
