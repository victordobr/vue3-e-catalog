<script setup>
import TheHeader from "@/components/TheHeader.vue";
import {useCategoryStore} from "@/stores/useCategoryStore.js";
import {useBrandStore} from "@/stores/useBrandStore.js";

const categoryStore = useCategoryStore();
categoryStore.fetchCategories();

const brandStore = useBrandStore();
brandStore.fetchBrands();
</script>

<template>
  <TheHeader></TheHeader>
  <RouterView />
</template>