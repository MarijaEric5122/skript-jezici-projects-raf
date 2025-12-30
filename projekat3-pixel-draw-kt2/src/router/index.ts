import { createRouter, createWebHistory } from "vue-router";
import Homepage from "@/views/Homepage.vue";
import Draw from "@/views/Draw.vue";
import Gallery from "@/views/Gallery.vue";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Homepage,
    },
    {
      path: "/draw",
      name: "draw",
      component: Draw,
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
      path: "/gallery",
      name: "gallery",
      component: Gallery,
    },
  ],
});

export default router;
