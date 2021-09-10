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
  <div>
    <label for="">Set Filter text</label>
    <input v-model="filterText" type="text" />
    <button @click="emit('apply', filterText)">Apply</button>
    <button @click="onClear">Clear</button>
  </div>
</template>
