<script setup>
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { storeToRefs } from "pinia";

const categoryStore = useCategoryStore();
const { currentCategory, categoryList } = storeToRefs(categoryStore)

const brandStore = useBrandStore();
const { currentBrand, brandList } = storeToRefs(brandStore)

</script>

<template>
  <!-- Sidebar-->
  <div class="border-end bg-white" id="sidebar-wrapper">
    <div class="sidebar-heading border-bottom"><h3>Categories</h3></div>
    <div class="list-group list-group-flush">
      <a v-for="category in categoryList"
         :class="{ active: currentCategory == category.id }"
         class="list-group-item list-group-item-action list-group-item-light p-3"
         @click="currentCategory = category.id"
         href="#">{{ category.name }}</a>
    </div>
    <hr/>
    <div class="sidebar-heading border-bottom"><h3>Brands</h3></div>
    <div class="list-group list-group-flush">
      <a v-for="brand in brandList"
         :class="{ active: currentBrand == brand.id }"
         class="list-group-item list-group-item-action list-group-item-light p-3"
         @click="currentBrand = brand.id"
         href="#">{{ brand.name }}</a>
    </div>
    <hr/>
  </div>
</template>

<style scoped>
#wrapper {
  overflow-x: hidden;
}

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  -webkit-transition: margin .25s ease-out;
  -moz-transition: margin .25s ease-out;
  -o-transition: margin .25s ease-out;
  transition: margin .25s ease-out;
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.85rem 1.25rem;
  font-size: 1.2rem;
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

#page-content-wrapper {
  min-width: 100vw;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: 0;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
}
</style>