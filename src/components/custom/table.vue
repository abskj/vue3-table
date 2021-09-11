<script setup>
import { defineEmits, defineProps, toRefs, ref, reactive, computed } from "vue";
import Cell from "./Cell.vue";
import Pagination from "./Pagination.vue";
import {
  composeFilter,
  composeSorting,
  composePagination,
} from "./composable/utils";

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
  minWidths: Array,
  maxWidths: Array,
  priority: Array,
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
getFilteredData(data);

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

getVisiblePage(filteredData);
</script>
<template>
  <div class="vm-table-wrapper">
    {{ numPages + " , " + totalItems + " , " + pageSize + " , " + filterTexts }}
    <button @click="check">Check</button>
    <table class="vm-table">
      <col v-for="colname in columnKeys" class="vm-table__column" />
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
</style>
