<template>
  <div class="border rounded p-2 flex flex-col">
    <div class="flex-1 flex items-center justify-center relative">
      <router-link
        :to="{ path: '/draw', query: { picture_id: picture.picture_id } }"
        class="absolute inset-0 z-10"
      ></router-link>
      <div class="grid-container border" :style="gridContainerStyle">
        <div
          v-for="(color, index) in flatPictureData"
          :key="'cell-' + index"
          class="grid-cell border"
          :style="{ backgroundColor: color }"
        ></div>
      </div>
    </div>
    <div class="mt-2 flex items-center justify-between">
      <a
        href="#"
        @click.prevent="filterByAuthor(picture.author.user_id)"
        class="text-blue-500 underline"
      >
        {{ picture.author.username }}
      </a>
      <div v-if="isOwner" class="flex space-x-2">
        <button class="text-sm text-blue-600 underline" @click="editPicture">
          Edit
        </button>
        <button
          class="text-sm text-red-600 underline"
          @click="confirmDelete = true"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="text-sm text-gray-500">
      {{ timeAgo(picture.updated_at) }}
    </div>
    <div class="text-sm">
      {{ picture.name || "(no title)" }}
    </div>

    <div
      v-if="confirmDelete"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="text-xl font-bold mb-4">Are you sure?</h2>
        <p class="mb-4">This action cannot be undone.</p>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-200 rounded"
            @click="confirmDelete = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded"
            @click="deletePicture"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { API_URL } from "@/config";

interface Author {
  user_id: string;
  username: string;
}

interface Picture {
  picture_id: string;
  author: Author;
  picture_data: string[][];
  updated_at: string;
  name?: string;
}

const props = defineProps<{ picture: Picture }>();
const emits = defineEmits<{
  (e: "filter-author", authorId: string): void;
  (e: "deleted", pictureId: string): void;
}>();

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const confirmDelete = ref(false);

const isOwner = computed(
  () => authStore.userId === props.picture.author.user_id
);

function filterByAuthor(authorId: string) {
  emits("filter-author", authorId);
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

function editPicture() {
  router.push({
    path: "/draw",
    query: { picture_id: props.picture.picture_id },
  });
}

async function deletePicture() {
  try {
    const resp = await fetch(
      `${API_URL}/pictures/${props.picture.picture_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    if (!resp.ok) throw new Error("Delete failed");
    toast.success("Picture deleted");
    confirmDelete.value = false;
    emits("deleted", props.picture.picture_id);
  } catch (err) {
    toast.error("Error deleting picture");
  }
}

function transpose<T>(matrix: T[][]): T[][] {
  if (!matrix.length) return [];
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

const transposedPictureData = computed(() =>
  transpose(props.picture.picture_data)
);

const flatPictureData = computed(() => transposedPictureData.value.flat());

const cols = computed(() => transposedPictureData.value[0]?.length || 1);

const gridContainerStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  width: "200px",
  height: "200px",
  gap: "0px",
}));
</script>

<style scoped>
.grid-cell {
  width: 100%;
  height: 100%;
}
</style>
