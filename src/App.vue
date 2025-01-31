<script setup>
import TheHeader from "@/components/TheHeader.vue";
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { onMounted } from "vue";

const categoryStore = useCategoryStore();
const brandStore = useBrandStore();

onMounted(async () => {
  await categoryStore.fetchCategories();
  await brandStore.fetchBrands();
});

</script>

<template>
  <TheHeader></TheHeader>
  <RouterView />
</template>