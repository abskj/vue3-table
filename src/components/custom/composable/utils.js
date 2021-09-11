import {ref, computed} from "vue"

function composeSorting(){
    const sortedData = ref([])

    const getSortedData = (input, isDesc, column) => {
    sortedData.value.length = 0
    let res = input.value.sort((a, b) => {
        if(isDesc){
        return a[column] > b[column] ? -1 : 1
        }
        else {
        return a[column] > b[column] ? 1 : -1
        }
    })
    sortedData.value.push(...res)
    }

    return { sortedData, getSortedData }
}

function composeFilter(columnKeys) {
    const filterTexts = ref(columnKeys.value.map(() => ""));
    const showFilterMenu = ref(columnKeys.value.map(() => false));
    const filteredData = ref([])

    const toggleFilter = (index) => {
        showFilterMenu.value[index] = !showFilterMenu.value[index];
    }

    const getFilteredData = (input) => {
        filteredData.value.length = 0
        let result = input.value.filter(row => {
            for(let i=0; i< columnKeys.value.length; i++){
                if(filterTexts.value[i] == ''){
                    continue
                }
                else {
                    if(!String(row[columnKeys.value[i]]).toLowerCase().includes(filterTexts.value[i].toLowerCase())){
                        return false;
                    }
                }
            }
            return true;
        })
        filteredData.value.push(...result)
    }

    return { filterTexts, showFilterMenu, filteredData, toggleFilter, getFilteredData}
}


function composePagination(data, pageSize){
    
    const pgSize = ref(pageSize.value) //duplicating as we cannot modify prop PageSize
    const currentPage = ref(0);
    const totalItems = ref(data.value.length);
    const visibleData = ref([])

    const numPages = computed(() => {
        return Math.ceil(totalItems.value / pgSize.value);
    });

    const isNullOrUndefined = (val) => {
    return val == null || val == undefined;
    };

    const getVisiblePage = (input) => {
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
    return {
        currentPage, totalItems, visibleData, getVisiblePage, numPages, pgSize
    }
}
export {composeFilter, composeSorting, composePagination}
