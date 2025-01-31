<script setup>
import TheSidebar from "@/components/TheSidebar.vue";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { computed } from "@vue/runtime-core";
import ModalComponent from "@/components/ModalComponent.vue";
import { onMounted, reactive, ref } from "vue";
import { Modal } from "bootstrap";
import { storeToRefs } from "pinia";
import Alert from "@/components/Alert.vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const brandStore = useBrandStore();

productStore.fetchProducts();
const { store } = storeToRefs(productStore)

const searchValue = ref(null);
const sortValue = ref(1); // Default value "Price: Low to High"

const productList = computed(() => {
  let products = productStore.store.products;
  // Sorting products by price
  products = products.sort(
    (a, b) => {
      if (sortValue.value == 1)
        return (a.price < b.price) ? -1 : 1;
      if (sortValue.value == 2)
        return (a.price > b.price) ? -1 : 1;
    }
  );
  // Search by product title
  if (searchValue.value)
    products = products.filter(
      (product) => (product.title.toLowerCase().indexOf(searchValue.value.toLowerCase()) > -1)
    );
  // Filter products by category
  if (categoryStore.currentCategory !== 'all')
    products = products.filter(
      (product) => (product.category.length && categoryStore.currentCategory === product.category[0]._id)
    );
  // Filter products by brands
  if (brandStore.currentBrand !== 'all')
    products = products.filter(
      (product) => (product.brand.length && brandStore.currentBrand === product.brand[0]._id)
    );

  return products;
});
// Modal window
const state = reactive({
  modal: null,
  modalHeader: null,
  modalContent: null,
});

onMounted(() => {
  state.modal = new Modal('#modal', {});
})

function openModal(id) {
  let prod = productStore.store.products.find((product) => product._id === id);
  state.modalHeader = prod.title;
  state.modalContent = prod.description;
  state.modal.show();
}

const closeModal = () => state.modal?.hide();

</script>

<template>
  <div class="d-flex" id="wrapper">
    <TheSidebar />
    <div id="page-content-wrapper" class="p-3">
      <Alert :message="store.message.value" :type="store.message.type"></Alert>
      <div class="row g-2 mb-3">
        <div class="col-9">
          <input v-model="searchValue" type="text" class="form-control" placeholder="Search by product title" />
        </div>
        <div class="col-3">
          <select v-model="sortValue" class="form-select">
            <option :value="1">Price: Low to High</option>
            <option :value="2">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div v-if="store.isLoading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="product in productList" :key="product._id" class="col">
          <div class="card h-100">
            <img :src="product.image" class="card-img-top" :alt="product.title" />
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
            </div>
            <div class="card-footer">
              <small class="text-muted">Price: {{ product.price }} ₴</small>
              <button @click="openModal(product._id)" class="btn btn-outline-primary float-end">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalComponent id="modal" @modal-close="closeModal">
      <template #header>{{ state.modalHeader }}</template>
      <template #content>{{ state.modalContent }}</template>
    </ModalComponent>
  </div>
</template>

<style scoped>
.card-img-top {
  padding: 20px;
  display: block;
  width: 100%;
  height: 215px;
  -o-object-fit: contain;
  object-fit: contain;
}
</style>