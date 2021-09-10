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
  isDescState.value[index] = !isDescState.value[index];
}

const filterTexts = ref(columnHeadings.value.map(() => ""));
const showFilterMenu = ref(columnHeadings.value.map(() => false));

function toggleFilter(index) {
  showFilterMenu.value[index] = !showFilterMenu.value[index];
}
function filterData(idx, text) {
  console.log("filter applied")
  console.log(idx, text)
  filterTexts.value[idx] = text
}
function getFilteredData(input) {
    console.log(filterTexts.value)
    return input.value.filter(row => {
        for(let i=0; i< columnHeadings.length; i++){
            if(filterTexts.value[i] == ''){
                continue
            }
            else {
                if(!row[columnHeadings.value[i]].contains(filterTexts.value[i])){
                    return false;
                }
            }
        }
    })
}
const filteredData = getFilteredData(data)
function clearFilter() {
  console.log("filer cleared");
}

//pagination

if (paginate.value && !pageSize.value) {
  throw Error("Please set page size");
}
const currentPage = ref(0);
const totalItems = ref(data.value.length);
const numPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});

const isNullOrUndefined = (val) => {
  return val == null || val == undefined;
};

function getVisiblePage(input, tableState = {}) {
  //{currentPage, pageSize}
  const output = ref([]);
  input = [...input.value];
  let ps = tableState?.pageSize;
  let cp = tableState?.currentPage;
  if (isNullOrUndefined(cp) || isNullOrUndefined(ps)) {
    ps = input.length;
    cp = 0;
  }
  output.value.push(...input.slice(cp * ps, cp * ps + ps));
  return output;
}

const visibleData = getVisiblePage(data, {
  currentPage: currentPage.value,
  pageSize: pageSize.value,
});

const check = () => {
  currentPage.value++;
  visibleData.value = getVisiblePage(data, {
  currentPage: 2,
  pageSize: pageSize.value,
});
};
</script>
<template>
  <div class="vm-table-wrapper">
    {{ numPages + " , " + totalItems + " , " + pageSize + " , " + filteredData }}
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
          @clearFilter="clearFilter"
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
        :totalItems="totalItems"
        :current="currentPage"
        :pageSize="pageSize"
      />
    </div>
  </div>
</template>
<style></style>
