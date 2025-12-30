<template>
  <h1 class="mb-6 flex items-center justify-center">
    <button class="p-2 text-gray-700 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
    <input type="color" v-model="selectedColor" class="ml-2" />
  </h1>

  <div
    class="flex flex-col items-center"
    @mousedown="startDrawing"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
  >
    <div
      v-for="(row, rowIndex) in gridSize"
      :key="'row-' + rowIndex"
      class="flex"
    >
      <div
        v-for="(col, colIndex) in gridSize"
        :key="'col-' + colIndex + '-row-' + rowIndex"
        :style="{ backgroundColor: cells[rowIndex][colIndex] }"
        class="w-[1.2rem] h-[1.2rem] border border-gray-200"
        @mousedown="colorCell(rowIndex, colIndex)"
        @mouseenter="dragColorCell(rowIndex, colIndex)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";

const selectedColor: Ref<string> = ref("#ff0000");
const gridSize = 25;

const cells: Ref<string[][]> = ref(
  Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "#ffffff")
  )
);

const isMouseDown: Ref<boolean> = ref(false);

function startDrawing() {
  isMouseDown.value = true;
}

function stopDrawing() {
  isMouseDown.value = false;
}

function colorCell(rowIndex: number, colIndex: number) {
  cells.value[rowIndex][colIndex] = selectedColor.value;
}

function dragColorCell(rowIndex: number, colIndex: number) {
  if (isMouseDown.value) {
    colorCell(rowIndex, colIndex);
  }
}
</script>

<style scoped>
* {
  user-select: none;
}
</style>
