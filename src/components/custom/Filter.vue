<script setup>
import { defineEmits, ref } from "vue";

const props = defineProps({});

const emit = defineEmits(["apply", "clear"]);
const filterText = ref("");

</script>
<template>
  <div>
    <label for="">Set Filter text</label>
    <input v-model="filterText" type="text" />
    <button @click="emit('apply', filterText)">Apply</button>
    <button @click="emit('clear')">Clear</button>
  </div>
</template>
