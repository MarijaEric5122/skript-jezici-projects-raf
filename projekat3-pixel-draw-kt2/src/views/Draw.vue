<template>
  <h1 class="mb-6 flex items-center justify-center space-x-4">
    <button
      class="p-2 text-gray-700 rounded-full"
      @click="selectTool('pencil')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'text-blue-500': tool === 'pencil' }"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M15.232 5.232l3.536 3.536-9.192 9.192H6.04v-3.536l9.192-9.192z"
        />
        <path
          d="M17.414 3.05a2.121 2.121 0 113 3l-1.414 1.414-3.536-3.536L17.414 3.05z"
        />
      </svg>
    </button>
    <button
      class="p-2 text-gray-700 rounded-full"
      @click="selectTool('eraser')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'text-blue-500': tool === 'eraser' }"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M8.485 19.071l-4.243-4.243a1 1 0 010-1.414l9.9-9.9a1 1 0 011.414 0l4.243 4.243a1 1 0 010 1.414l-9.9 9.9a1 1 0 01-1.414 0z"
        />
        <path d="M6.343 17.657L12.9 11.1" />
      </svg>
    </button>
    <input type="color" v-model="selectedColor" class="ml-2" />
    <button class="p-2 text-gray-700 rounded-full" @click="changeGridSize(-1)">
      -
    </button>
    <span>{{ gridRows }} x {{ gridCols }}</span>
    <button class="p-2 text-gray-700 rounded-full" @click="changeGridSize(1)">
      +
    </button>
    <button
      class="gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 w-9 hover:bg-gray-50 p-1 rounded-lg flex justify-center items-center"
      @click="showSaveModal = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-save-icon size-4"
      >
        <path
          d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        ></path>
        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
        <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
      </svg>
    </button>
  </h1>

  <div
    class="flex justify-center items-center"
    @mousedown="startDrawing"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
  >
    <div class="grid" :style="gridStyle">
      <div
        v-for="(cellColor, index) in cells"
        :key="index"
        :style="{
          backgroundColor: cellColor,
          width: cellSize + 'px',
          height: cellSize + 'px',
        }"
        class="border border-gray-200"
        @mousedown="colorCellByIndex(index)"
        @mouseenter="dragColorCellByIndex(index)"
      ></div>
    </div>
  </div>

  <div
    v-if="showSaveModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-80">
      <h2 class="text-xl font-bold mb-4">Save drawing</h2>
      <input
        v-model="saveName"
        type="text"
        class="border w-full p-2 mb-4"
        placeholder="Drawing name"
      />
      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 bg-gray-200 rounded"
          @click="showSaveModal = false"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 text-white rounded"
          :class="isOwner ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'"
          @click="isOwner ? saveDrawing() : notYours()"
        >
          {{
            isOwner ? (pictureId ? "Save (Update)" : "Save (New)") : "Not yours"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { API_URL } from "@/config";

const toast = useToast();
const authStore = useAuthStore();
const route = useRoute();

const selectedColor = ref("#ff0000");
const tool = ref("pencil");
const isMouseDown = ref(false);
const cells = ref<string[]>([]);
const showSaveModal = ref(false);
const saveName = ref("");
const pictureId = ref<string | null>(null);
const authorId = ref<string | null>(null);
const gridRows = ref(16);
const gridCols = ref(16);

function selectTool(selectedTool: string) {
  tool.value = selectedTool;
}

function startDrawing() {
  isMouseDown.value = true;
}

function stopDrawing() {
  isMouseDown.value = false;
}

function initializeCells(rows: number, cols: number) {
  const totalCells = rows * cols;
  const newCells = Array.from({ length: totalCells }, (_, index) => {
    return cells.value[index] || "#ffffff";
  });
  cells.value = newCells;
}

function colorCellByIndex(index: number) {
  if (tool.value === "pencil") {
    cells.value[index] = selectedColor.value;
  } else if (tool.value === "eraser") {
    cells.value[index] = "#ffffff";
  }
}

function dragColorCellByIndex(index: number) {
  if (isMouseDown.value) {
    colorCellByIndex(index);
  }
}

function changeGridSize(delta: number) {
  if (pictureId.value) {
    toast.error("Cannot change grid size of a loaded picture");
    return;
  }
  let newSize = gridRows.value + delta;
  if (newSize < 1) newSize = 1;
  if (newSize > 16) newSize = 16;

  gridRows.value = newSize;
  gridCols.value = newSize;
  initializeCells(gridRows.value, gridCols.value);
}

const maxGridSizePx = 480;
const cellSize = computed(() => {
  return Math.floor(maxGridSizePx / Math.max(gridRows.value, gridCols.value));
});

const gridStyle = computed(() => {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${gridCols.value}, ${cellSize.value}px)`,
    gridTemplateRows: `repeat(${gridRows.value}, ${cellSize.value}px)`,
  };
});

const isOwner = computed(() => {
  if (!pictureId.value) return true;
  return authorId.value && authStore.userId === authorId.value;
});

function validName(name: string) {
  return name.length >= 2 && name.length <= 40;
}

async function loadPictureData(pId: string) {
  try {
    const response = await fetch(`${API_URL}/pictures/${pId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to load picture");
    const data = await response.json();
    const picture = data.picture;

    pictureId.value = picture.picture_id;
    authorId.value = picture.author.user_id;
    saveName.value = picture.name || "";

    const pData = picture.picture_data as string[][];

    const originalRows = pData.length;
    const originalCols = pData[0].length;
    gridRows.value = originalCols;
    gridCols.value = originalRows;

    const flat: string[] = [];
    for (let r = 0; r < gridRows.value; r++) {
      for (let c = 0; c < gridCols.value; c++) {
        flat.push(pData[c][r]);
      }
    }

    cells.value = flat;
  } catch (err) {
    toast.error("Error loading picture");
  }
}

async function saveDrawing() {
  if (!validName(saveName.value)) {
    toast.error("Name must be between 2 and 40 characters");
    return;
  }

  const pData: string[][] = [];
  for (let r = 0; r < gridCols.value; r++) {
    const row: string[] = [];
    for (let c = 0; c < gridRows.value; c++) {
      row.push(cells.value[c * gridCols.value + r]);
    }
    pData.push(row);
  }

  const method = pictureId.value ? "PATCH" : "POST";
  const endpoint = pictureId.value
    ? `${API_URL}/pictures/${pictureId.value}`
    : `${API_URL}/pictures`;

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: saveName.value,
        picture_data: pData,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save");
    }
    toast.success("Drawing saved successfully");
    showSaveModal.value = false;
    if (!pictureId.value) {
      const totalCells = gridRows.value * gridCols.value;
      cells.value = Array(totalCells).fill("#ffffff");
    }
  } catch (error) {
    toast.error("Not logged in");
  }
}

function notYours() {
  toast.error("Not yours");
}

onMounted(() => {
  const pId = route.query.picture_id as string | undefined;
  if (pId) {
    loadPictureData(pId);
  } else {
    initializeCells(gridRows.value, gridCols.value);
  }
});
</script>

<style scoped>
* {
  user-select: none;
}
</style>
