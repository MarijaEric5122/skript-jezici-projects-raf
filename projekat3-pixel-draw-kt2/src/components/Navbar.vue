<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";

const toast = useToast();

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const username = computed(() => authStore.username);
const userId = computed(() => authStore.userId);

const handleLogout = () => {
  authStore.logout();
  toast.success("Successful logout");
  router.push('/');
};

const firstLetter = computed(() => {
  return username.value ? username.value.charAt(0).toUpperCase() : '';
});
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-5 pb-2 border-b-2 border-b-gray-900 mb-7"
    >
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div class="hidden w-full md:flex md:items-center md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col md:flex-row p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg bg-gray-50 md:bg-white md:border-0 md:space-x-8 rtl:space-x-reverse dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <RouterLink
              to="/"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/draw"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Draw</RouterLink
            >
          </li>
          <li v-if="isAuthenticated">
            <RouterLink
              :to="`/gallery?page=1&author=${userId}`"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >My Gallery</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/gallery"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Gallery</RouterLink
            >
          </li>
          <li v-if="!isAuthenticated">
            <RouterLink
              to="/register"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Register</RouterLink
            >
          </li>
          <li v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >Login</RouterLink
            >
          </li>
          <li v-if="isAuthenticated">
            <a
              href="#"
              @click.prevent="handleLogout"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent
                     md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                     dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div v-if="isAuthenticated" class="flex items-center">
        <div
          class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-l"
          aria-label="User badge"
          title="User badge"
        >
          {{ firstLetter }}
        </div>
      </div>
    </div>
  </nav>
</template>