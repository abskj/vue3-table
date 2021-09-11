<script setup>
import { defineEmits, ref } from "vue";

const props = defineProps({});

const emit = defineEmits(["apply", "clear"]);
const filterText = ref("");

function onClear(){
  filterText.value = ''
  emit('clear')
}

</script>
<template>
    <div class="filter">
    <label for="">Set Filter text</label>
    <input v-model="filterText" type="text" />
    <div>
      <button @click="emit('apply', filterText)">Apply</button>
      <button @click="onClear">Clear</button>
    </div>
  </div>
</template>

<style scoped>
.filter{
  top: 2rem;
  float: inline-start;
  display: flex;
  flex-direction: column;
  border: 1px solid aquamarine;
  background-color: var(--filter-bg, white);
  padding: var(--filter-padding, 0.6rem)
}
</style>
