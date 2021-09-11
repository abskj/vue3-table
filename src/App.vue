<script setup>
import MyTable from "./components/custom/table.vue";

const cars = [
  { brand: "Volkswagen", year: 2012, color: "Orange", vin: "dsad231ff" },
  { brand: "Audi", year: 2011, color: "Black", vin: "gwregre345" },
  { brand: "Renault", year: 2005, color: "Gray", vin: "h354htr" },
  { brand: "BMW", year: 2003, color: "Blue", vin: "j6w54qgh" },
  { brand: "Mercedes", year: 1995, color: "Orange", vin: "hrtwy34" },
  { brand: "Volvo", year: 2005, color: "Black", vin: "jejtyj" },
  { brand: "Honda", year: 2012, color: "Yellow", vin: "g43gr" },
  { brand: "Jaguar", year: 2013, color: "Orange", vin: "greg34" },
  { brand: "Ford", year: 2000, color: "Black", vin: "h54hw5" },
  { brand: "Fiat", year: 2013, color: "Red", vin: "245t2s" },
];
const header = ["Brand", "Year", "Vin", "Color"];
const order = ["brand", "year", "vin", "color"];
</script>

<template>
  <div>
    <h2>Reusable table component</h2>
    <div>
      <MyTable
        :data="cars"
        :columnHeadings="header"
        :columnOrder="order"
        :sortableColumns="['brand', 'year']"
        :filterableColumns="['color', 'year']"
        paginate
        :pageSize="7"
        :minWidths="{year:'250px'}"
        :maxWidths="{}"
        :fullWidth="false"
        :priority="['brand', 'color', 'year', 'vin']"
      >
        <!-- <template v-slot:row="{ row, columns }">
          <td v-for="col in columns" :key="row[col]">
            <p>
              {{ row[col] }}
            </p>
          </td>
        </template> -->
      </MyTable>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
