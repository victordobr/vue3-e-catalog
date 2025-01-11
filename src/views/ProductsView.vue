<script setup>
import { useProductStore } from "@/stores/useProductStore.js";
import { storeToRefs } from "pinia";
import PencilSvg from "@/components/svg/PencilSvg.vue";
import TrashSvg from "@/components/svg/TrashSvg.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { onMounted, reactive } from "vue";
import { Modal } from "bootstrap";
import FormProduct from "@/components/forms/FormProduct.vue";
import Alert from "@/components/Alert.vue";

const productStore = useProductStore();

productStore.fetchProducts();

const {
  products,
  isLoading,
  message,
} = storeToRefs(productStore);

// Modal window
const state = reactive({
  modal: null,
  modalHeader: null,
  product: {
    'title': '',
    'price': '',
    'description': '',
    'image': '',
    'categoryId': '',
    'brandId': '',
  },
});

onMounted(() => {
  state.modal = new Modal('#modal', {});
})

function openModal(id) {
  if (id) {
    state.modalHeader = 'Edit product';
    state.product = Object.assign({}, productStore.products.find((item) => item._id === id));
  } else {
    state.modalHeader = 'Create product';
    state.product = {
      'title': '',
      'price': '',
      'description': '',
      'image': '',
      'categoryId': '',
      'brandId': '',
    };
  }
  state.modal.show();
}

function closeModal() {
  state.modal.hide();
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    productStore.deleteProduct(productId);
  }
}

</script>

<template>
<div id="page-content-wrapper" class="p-3">
  <Alert :message="message"></Alert>
  <h1 class="float-start">Product list</h1>
  <button @click="openModal()" type="button" class="btn btn-outline-primary float-end">Create product</button>
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Price</th>
        <th scope="col">Image</th>
        <th scope="col">Category</th>
        <th scope="col">Brand</th>
        <th scope="col" class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products">
        <td>{{ index + 1 }}</td>
        <td>{{ product.title }}</td>
        <td>{{ product.price }}</td>
        <td><img :src="product.image" class="img-thumbnail" :alt="product.title" width="100" height="100"></td>
        <td>{{ product.category.length ? product.category[0].name : 'none' }}</td>
        <td>{{ product.brand.length ? product.brand[0].name : 'none' }}</td>
        <td class="text-center">
          <a @click="openModal(product._id)" href="#" class="me-3"><PencilSvg></PencilSvg></a>
          <a @click="deleteProduct(product._id)" href="#"><TrashSvg></TrashSvg></a>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="isLoading" class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <ModalComponent id="modal" @modal-close="closeModal">
    <template #header>{{ state.modalHeader }}</template>
    <template #content><FormProduct :product="state.product" @modal-close="closeModal"></FormProduct></template>
  </ModalComponent>
</div>
</template>

<style scoped>

</style>