<script setup>
import { defineEmits, defineProps, toRefs, ref, reactive, computed } from "vue";
import Cell from "./Cell.vue";
import Pagination from "./Pagination.vue";

/*
 * index refers by default to column index
 */

const props = defineProps({
  data: Array,
  columnHeadings: Array,
  columnOrder: Array,
  filterableColumns: Array,
  sortableColumns: Array,
  paginate: Boolean,
  pageSize: Number,
  searchKey: String,
});

const {
  data,
  columnHeadings,
  columnOrder,
  filterableColumns,
  sortableColumns,
  paginate,
  pageSize,
} = toRefs(props);

if (!(data.value && columnHeadings.value && data.value.length)) {
  throw Error("empty table");
}

const columnKeys = ref([]);
if (columnOrder.value) {
  columnKeys.value.push(...columnOrder.value);
} else {
  columnKeys.value.push(...Object.keys(data.value[0]));
}

const showSortOption = ref(
  columnKeys.value.map((col) =>
    sortableColumns.value ? sortableColumns.value.includes(col) : false
  )
);

const showFilterOption = ref(
  columnKeys.value.map((col) =>
    filterableColumns.value ? filterableColumns.value.includes(col) : false
  )
);

const isDescState = ref(columnHeadings.value.map(() => false));

function sortColumn(index) {
  getFilteredData(data)
  getSortedData(filteredData, isDescState.value[index], columnKeys.value[index])
  getVisiblePage(sortedData)
  isDescState.value[index] = !isDescState.value[index];
}

const sortedData = ref([])

function getSortedData(input, isDesc, column){
  sortedData.value.length = 0
  let res = input.value.sort((a, b) => {
    if(isDesc){
      return a[column] > b[column] ? -1 : 1
    }
    else {
      return a[column] > b[column] ? 1 : -1
    }
  })
  console.log(res)
  sortedData.value.push(...res)
}

const filterTexts = ref(columnHeadings.value.map(() => ""));
const showFilterMenu = ref(columnHeadings.value.map(() => false));
const filteredData = ref([])

function toggleFilter(index) {
  showFilterMenu.value[index] = !showFilterMenu.value[index];
}
function filterData(idx, text) {
  filterTexts.value[idx] = String(text)
  getFilteredData(data)
  getVisiblePage(filteredData)
}
function getFilteredData(input) {
    filteredData.value.length = 0
    console.log(filterTexts.value)
    let result = input.value.filter(row => {
      console.log(row)
        for(let i=0; i< columnKeys.value.length; i++){
          console.log(filterTexts.value[i])
            if(filterTexts.value[i] == ''){
                continue
            }
            else {
              console.log(row[columnKeys.value[i]])
                if(!String(row[columnKeys.value[i]]).toLowerCase().includes(filterTexts.value[i].toLowerCase())){
                    return false;
                }
            }
        }
        return true;
    })
    console.log(result)
    filteredData.value.push(...result)
}
getFilteredData(data)

function clearFilter(idx) {
  filterTexts.value[idx] = ''
  getFilteredData(data)
  getVisiblePage(filteredData)
}

//pagination

if (paginate.value && !pageSize.value) {
  throw Error("Please set page size");
}
const pgSize = ref(pageSize.value) //duplicating as we cannot modify prop PageSize
const currentPage = ref(0);
const totalItems = ref(data.value.length);
const numPages = computed(() => {
  return Math.ceil(totalItems.value / pgSize.value);
});

const isNullOrUndefined = (val) => {
  return val == null || val == undefined;
};
const visibleData = ref([])

function getVisiblePage(input) {
  visibleData.value.length = 0
  input = [...input.value];
  let ps = pgSize.value;
  let cp = currentPage.value;

  if (isNullOrUndefined(cp) || isNullOrUndefined(ps)) {
    ps = input.length;
    cp = 0;
  }
  visibleData.value.push(...input.slice(cp * ps, cp * ps + ps));
}

function onPageUpdate(n){
  currentPage.value = n;
  getVisiblePage(filteredData)
}

function onPageSizeUpdate(n){
  pgSize.value = n;
  currentPage.value = 0
  getVisiblePage(filteredData)
}

getVisiblePage(filteredData);

const check = () => {
  // alert('check funtion called')
  // // currentPage.value = 1
  // getFilteredData(data)
  // getVisiblePage(filteredData)
};
</script>
<template>
  <div class="vm-table-wrapper">
    {{ numPages + " , " + totalItems + " , " + pageSize + " , " + filterTexts }}
    <button @click="check">Check</button>
    <table class="vm-table">
      <!-- heading -->
      <tr>
        <Cell
          v-for="(colname, idx) in columnHeadings"
          :key="colname"
          head
          :text="colname"
          :showSort="showSortOption[idx]"
          :showFilterOption="showFilterOption[idx]"
          :showFilterMenu="showFilterMenu[idx]"
          :isDesc="isDescState[idx]"
          @toggleFilter="toggleFilter(idx)"
          @sort="sortColumn(idx)"
          @applyFilter="filterData(idx, $event)"
          @clearFilter="clearFilter(idx)"
        />
      </tr>
      <!-- body -->
      <tr v-for="(row, idx) in visibleData" :key="idx">
        <slot name="row" :row="row" :columns="columnKeys">
          <td v-for="colname in columnKeys">
            {{ row[colname] }}
          </td>
        </slot>
      </tr>
    </table>
    <div class="pagination-wrapper">
      <Pagination
        :numOfPages="numPages"
        :current="currentPage"
        :pageSize="pageSize"
        @updatedPageNumber="onPageUpdate"
        @updatedPageSize="onPageSizeUpdate"
      />
    </div>
  </div>
</template>
<style></style>
