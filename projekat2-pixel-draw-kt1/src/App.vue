<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <header>
    <div class="container mx-auto px-6">
      <Navbar></Navbar>

      <RouterView />
    </div>
  </header>
</template>
