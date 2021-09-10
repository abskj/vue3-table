<script setup>
import FilterMenu from './Filter.vue'
import {defineProps} from 'vue'


const props = defineProps({
  head: Boolean,
  text: String,
  showFilterOption: Boolean,
  isDesc: Boolean,
  showSort: Boolean,
  showFilterMenu: Boolean,
});
const emit = defineEmits(["sort", "toggleFilter", "applyFilter", "clearFilter"])

function onFilterApply(text){
  emit('applyFilter', text)
}
</script>
<template>
  <th v-if="head">
    <slot name="header">
      <slot>
        <div>
            {{ text }}
        </div>
      </slot>
      <div v-if="showSort" @click="emit('sort')">
        <slot name="sort">
            <button>Sort {{isDesc ? 'desc' : 'asc'}}</button>
        </slot>
      </div>
      <div v-if="showFilterOption" @click="emit('toggleFilter')">
        <slot name="filterButton">
            <button>Filter</button>
        </slot>
      </div>
      <div v-if="showFilterMenu">
        <slot name="filterMenu">
          <FilterMenu @apply="onFilterApply" @clear="emit('clearFilter')"/>
        </slot>
      </div>
    </slot>
  </th>
  <td v-else>
    <slot></slot>
  </td>
</template>
