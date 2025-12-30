import { createRouter, createWebHistory } from "vue-router";
import Homepage from "@/views/Homepage.vue";
import Crtanje from "@/views/Crtanje.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Galerija from "@/views/Galerija.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Homepage,
    },
    {
      path: "/crtanje",
      name: "crtanje",
      component: Crtanje,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/galerija",
      name: "galerija",
      component: Galerija,
    },
  ],
});

export default router;
