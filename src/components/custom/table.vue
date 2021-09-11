<script setup>
import { defineEmits, defineProps, toRefs, ref, reactive, computed, onMounted, nextTick, onUnmounted } from "vue";
import Cell from "./Cell.vue";
import Pagination from "./Pagination.vue";
import {
  composeFilter,
  composeSorting,
  composePagination,
} from "./composable/utils";

/* note:
 * index refers by default to column index
 * functions begining with 'get' are not getters but they update the value of that particular varaible
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
  minWidths: {
    type: Object,
    default: {}
  }, //key-value pair of column-key and value
  maxWidths: {
    type: Object,
    default: {}
  }, //key-value pair of column-key and value
  priority: {
    type: Array,
    default: []
  },
  fullWidth: {
    type: Boolean,
    default: true,
  },
});

const {
  data,
  columnHeadings,
  columnOrder,
  filterableColumns,
  sortableColumns,
  paginate,
  pageSize,
  minWidths,
  maxWidths,
  priority,
  fullWidth,
} = toRefs(props);

if (!(data.value && columnHeadings.value && data.value.length)) {
  throw Error("empty table");
}

// columnKeys will store the keys in order of display
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

//sorting related Logic
const { sortedData, getSortedData } = composeSorting();
const isDescState = ref(columnHeadings.value.map(() => false));

function sortColumn(index) {
  getFilteredData(data);
  getSortedData(
    filteredData,
    isDescState.value[index],
    columnKeys.value[index]
  );
  getVisiblePage(sortedData);
  isDescState.value[index] = !isDescState.value[index];
}

//FIlter related logic

const {
  filterTexts,
  showFilterMenu,
  filteredData,
  toggleFilter,
  getFilteredData,
} = composeFilter(columnKeys);

function filterData(idx, text) {
  filterTexts.value[idx] = String(text);
  getFilteredData(data);
  getVisiblePage(filteredData);
  showFilterMenu.value[idx] = false;
}

function clearFilter(idx) {
  filterTexts.value[idx] = "";
  getFilteredData(data);
  getVisiblePage(filteredData);
  showFilterMenu.value[idx] = false;
}

//pagination logic

if (paginate.value && !pageSize.value) {
  throw Error("Please set page size");
}

const { currentPage, totalItems, visibleData, getVisiblePage, numPages, pgSize } =
  composePagination(data, pageSize);

function onPageUpdate(n) {
  currentPage.value = n;
  getVisiblePage(filteredData);
}

function onPageSizeUpdate(n) {
  pgSize.value = n;
  currentPage.value = 0;
  getVisiblePage(filteredData);
}

getFilteredData(data);
getVisiblePage(filteredData);

//========================================================================

const tableParent = ref(null)
const colRefs = {}
const setColRef = (el) => {
  colRefs[el.getAttribute("columnKey")] = el
}
const setMinWidth = (el, val)=>{
  el.style.minWidth = val
}
const setMaxWidth = (el, val) => {
  el.style.maxWidth = val
}
const isOverflown = (el) => {
  let isOverflowing = el.clientWidth < el.scrollWidth 
  // console.log(el.scrollWidth, el.clientWidth)
  return isOverflowing;
}

const columnHiddenStack = []
const lastHideScrollWidth = []

const hideColumn = (key) =>{
  let prevWidth = tableParent.value.scrollWidth
  let idx = columnKeys.value.indexOf(key) +1
  document.querySelectorAll(`td:nth-child(${idx}), th:nth-child(${idx})`).forEach(x=> x.classList.add('hidden'))
  columnHiddenStack.push(key)
  lastHideScrollWidth.push(prevWidth)
}

const showColumn = (key) =>{
  let idx = columnKeys.value.indexOf(key) +1
  document.querySelectorAll(`td:nth-child(${idx}), th:nth-child(${idx})`).forEach(x=> x.classList.remove('hidden'))
  lastHideScrollWidth.pop()
}

const getColToHide = () => {
  let colIdx = priority.value.length - 1- columnHiddenStack.length
  if(colIdx < 1){
    return ""
  }
  else {
    console.log(priority.value[colIdx])
    return priority.value[colIdx]
  }
}


function hideOrShowLessImportantColumn() {
  if(priority.value.length){
    if(isOverflown(tableParent.value) && getColToHide()){
      hideColumn(getColToHide())
      if(isOverflown(tableParent.value)){
        hideOrShowLessImportantColumn()
      }
    }
    else{
      if(lastHideScrollWidth.length){
        if((lastHideScrollWidth[lastHideScrollWidth.length -1])<=tableParent.value.clientWidth){
          let colToShow = columnHiddenStack.pop()
          showColumn(colToShow)
          hideOrShowLessImportantColumn()
        }
      }
    }
  }
  
}
onMounted(()=>{
  Object.keys(minWidths.value).forEach(k => setMinWidth(colRefs[k], minWidths.value[k]))
  Object.keys(maxWidths.value).forEach(k => setMaxWidth(colRefs[k], maxWidths.value[k]))
  hideOrShowLessImportantColumn()
  window.addEventListener('resize', hideOrShowLessImportantColumn)
})

onUnmounted(()=>{
  window.removeEventListener('resize', hideOrShowLessImportantColumn)
})

</script>
<template>
  <div class="vm-table-wrapper"  ref="tableParent">
    <table class="vm-table" :class="{'full-width': fullWidth}">
      <col v-for="(colname, idx) in columnKeys" :columnKey="colname" :key="colname" class="vm-table__column" :ref="setColRef" />
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
      <tr v-for="(row, idx) in visibleData" :key="idx" class="vm-table__row">
        <slot name="row" :row="row" :columns="columnKeys">
          <Cell
            v-for="colname in columnKeys"
            :key="colname + '_' + idx"
            :text="row[colname]"
          />
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
<style>
.vm-table-wrapper {
  /* width: 100%; */
  /* display:/ grid; */
  /* grid-; */
}
.vm-table {
  /* margin: auto; */
  /* width: 100%; */
  /* max-width: 500px; */
  overflow-y: scroll;
}

.full-width {
  width: 100%;
}

.vm-table * td,
.vm-table * th {
  padding: 0.5em;
}
.vm-table__row {
  transition-duration: 100ms;
}
.vm-table__row:hover {
  background-color: #c2c2c2;
}
.vm-table__column {
  /* min-width: 200px; */
}
.hidden {
  display: none;
}
</style>
