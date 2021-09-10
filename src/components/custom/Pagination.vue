<script setup>
import { defineProps, toRefs } from 'vue'

const props =  defineProps({
    numOfPages: {
        type: Number,
        required: true,
    },
    current: {
        type: Number,
        required: true
    },
    pageSizeOptions: {
        type: Array,
        default: [10,50, 100]
    },
    pageSize: {
        type: Number,
        required: true
    }
})
const {current} = toRefs(props)
const emit = defineEmits(['updatedPageNumber', 'updatedPageSize'])

function isActive(pageNo){
    if((pageNo-current.value)==1){
        return true
    }
    return null
}
function setPage(num) {
    emit("updatedPageNumber", num-1)
}
function setPageSize(num) {
    emit("updatedPageSize", num)
}
</script>
<template>
<div>
    
    <button v-for="p in numOfPages" :key="p" @click="setPage(p)" :disabled="isActive(p)">{{p}}</button>
    <select name="" id="" @input="setPageSize($event.target.value)">
        <option :value="pageSize">{{pageSize}}</option>
        <option v-for="ps in pageSizeOptions" :value="ps">{{ps}}</option>
    </select>
</div>
</template>