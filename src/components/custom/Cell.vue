<script setup>
import FilterMenu from "./Filter.vue";
import { defineProps } from "vue";

const props = defineProps({
  head: Boolean,
  text: String | Number,
  showFilterOption: Boolean,
  isDesc: Boolean,
  showSort: Boolean,
  showFilterMenu: Boolean,
});
const emit = defineEmits([
  "sort",
  "toggleFilter",
  "applyFilter",
  "clearFilter",
]);

function onFilterApply(text) {
  emit("applyFilter", text);
}
</script>
<template>
  <th v-if="head" class="">
    <slot name="header">
      <div class="vm-cell__head">
        <slot>
          <div class="vm-cell__text">
            {{ text }}
          </div>
        </slot>
        <div class="vm-cell__actions">
          <div v-if="showFilterOption" @click="emit('toggleFilter')">
          <slot name="filterButton">
            <button>Filter</button>
          </slot>
        </div>
        <div v-if="showFilterMenu" class="filter-wrapper">
          <slot name="filterMenu">
            <FilterMenu @apply="onFilterApply" @clear="emit('clearFilter')" />
          </slot>
        </div>
        <div v-if="showSort" @click="emit('sort')">
          <slot name="sort">
            <button>Sort {{ isDesc ? "desc" : "asc" }}</button>
          </slot>
        </div>
        </div>
      </div>
    </slot>
  </th>
  <td v-else class="vm-table__column">
    <slot>{{ text }}</slot>
  </td>
</template>
<style>
.filter-wrapper {
  position: absolute;
}
.vm-cell__head {
  border: 2px solid blue;
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
}
.vm-cell__actions {
  display: flex;
}
.vm-cell__text {
  /* margin: 0.5em; */
}
</style>
