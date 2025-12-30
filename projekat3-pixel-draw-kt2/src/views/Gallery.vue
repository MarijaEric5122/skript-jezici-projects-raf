<template>
  <div class="max-w-screen-xl mx-auto p-4 space-y-4">
    <div class="flex flex-wrap gap-4 justify-center">
      <PictureCard
        v-for="picture in pictures"
        :key="picture.picture_id"
        :picture="picture"
        @filter-author="filterByAuthor"
        @deleted="handleDelete"
      />
    </div>

    <Pagination
      :totalItems="total"
      :itemsPerPage="PAGINATION"
      :currentPage="page"
      @update:page="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Pagination from "../components/Pagination.vue";
import PictureCard from "../components/PictureCard.vue";
import { API_URL } from "@/config";

const PAGINATION = 8;
const page = ref(1);
const pictures = ref<any[]>([]);
const total = ref(0);

const router = useRouter();
const route = useRoute();

async function loadPictures() {
  const url = new URL(`${API_URL}/pictures`);
  url.searchParams.set("page", String(page.value));
  url.searchParams.set("limit", String(PAGINATION));
  if (route.query.author) {
    url.searchParams.set("author", route.query.author as string);
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  pictures.value = data.pictures;
  total.value = data.total;
}

function goToPage(newPage: number) {
  const query = { ...route.query, page: String(newPage) };
  router.push({ query });
}

function filterByAuthor(authorId: string) {
  const query = { ...route.query, page: "1", author: authorId };
  router.push({ query });
}

function handleDelete() {
  router.go(0);
}

onMounted(() => {
  if (route.query.page) {
    page.value = Number(route.query.page);
  }
  loadPictures();
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.page) {
      page.value = Number(newQuery.page);
    } else {
      page.value = 1;
    }
    loadPictures();
  }
);
</script>

<style scoped></style>
