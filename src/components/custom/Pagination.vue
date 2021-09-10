<script setup>
import { defineProps } from 'vue'

const pages = [1,2,3,4]
const props =  defineProps({
    totalItems: {
        type: Number,
        required: true,
    },
    current: {
        type: Number,
        required: true
    },
    pageSizeOptions: {
        type: Array
    },
    pageSize: {
        type: Number,
        required: true
    }
})
</script>
<template>
<div>
    <button v-for="p in pages" :key="p">{{p}}</button>
    <select name="" id="">
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
    </select>
</div>
</template>