<template>
  <nav class="flex items-center justify-center space-x-1">
    <button
      :disabled="currentPage === 1"
      @click="$emit('update:page', 1)"
      class="px-2 py-1 border rounded disabled:opacity-50"
    >
      «
    </button>
    <button
      :disabled="currentPage === 1"
      @click="$emit('update:page', currentPage - 1)"
      class="px-2 py-1 border rounded disabled:opacity-50"
    >
      ‹
    </button>
    <span v-for="p in displayedPages" :key="p.key">
      <button
        v-if="p.type === 'page'"
        @click="$emit('update:page', p.page)"
        class="px-2 py-1 border rounded"
        :class="{ 'bg-blue-500 text-white': currentPage === p.page }"
      >
        {{ p.page }}
      </button>
      <span v-else class="px-2 py-1">...</span>
    </span>
    <button
      :disabled="currentPage === totalPages"
      @click="$emit('update:page', currentPage + 1)"
      class="px-2 py-1 border rounded disabled:opacity-50"
    >
      ›
    </button>
    <button
      :disabled="currentPage === totalPages"
      @click="$emit('update:page', totalPages)"
      class="px-2 py-1 border rounded disabled:opacity-50"
    >
      »
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

const props = defineProps<Props>();

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);

function generatePages(total: number, current: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      type: "page" as const,
      page: i + 1,
      key: `p${i + 1}`,
    }));
  }

  const pages: { type: "page" | "dots"; page?: number; key: string }[] = [];

  const firstPage = { type: "page" as const, page: 1, key: "first" };
  const lastPage = { type: "page" as const, page: total, key: "last" };

  let start = current - 2;
  let end = current + 2;

  if (start < 2) {
    start = 2;
    end = 2 + 4;
  }

  if (end > total - 1) {
    end = total - 1;
    start = end - 4;
    if (start < 2) start = 2;
  }

  pages.push(firstPage);

  if (start > 2) {
    pages.push({ type: "dots", key: "dots1" });
  }

  for (let i = start; i <= end; i++) {
    pages.push({ type: "page", page: i, key: `m${i}` });
  }

  if (end < total - 1) {
    pages.push({ type: "dots", key: "dots2" });
  }

  pages.push(lastPage);

  return pages;
}

const displayedPages = computed(() =>
  generatePages(totalPages.value, props.currentPage)
);
</script>
