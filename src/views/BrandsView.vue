<script setup>
import { storeToRefs } from "pinia";
import PencilSvg from "@/components/svg/PencilSvg.vue";
import TrashSvg from "@/components/svg/TrashSvg.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { onMounted, reactive } from "vue";
import { Modal } from "bootstrap";
import Alert from "@/components/Alert.vue";
import { useBrandStore } from "@/stores/useBrandStore.js";
import FormBrand from "@/components/forms/FormBrand.vue";

const brandStore = useBrandStore();

brandStore.fetchBrands();

const {
  brands,
  isLoading,
  message,
} = storeToRefs(brandStore);

// Modal window
const state = reactive({
  modal: null,
  modalHeader: null,
  brand: {
    'name': '',
    'description': '',
  },
});

onMounted(() => {
  state.modal = new Modal('#modal', {});
})

function openModal(id) {
  if (id) {
    state.modalHeader = 'Edit brand';
    state.brand = Object.assign({}, brandStore.brands.find((item) => item._id === id));
  } else {
    state.modalHeader = 'Create brand';
    state.brand = {
      'name': '',
      'description': '',
    };
  }
  state.modal.show();
}

function closeModal() {
  state.modal.hide();
}

function deleteBrand(brandId) {
  if (confirm("Are you sure you want to delete this brand?")) {
    brandStore.deleteBrand(brandId);
  }
}

</script>

<template>
<div id="page-content-wrapper" class="p-3">
  <Alert :message="message"></Alert>
  <h1 class="float-start">Product list</h1>
  <button @click="openModal()" type="button" class="btn btn-outline-primary float-end">Create brand</button>
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col" class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(brand, index) in brands">
        <td>{{ index + 1 }}</td>
        <td>{{ brand.name }}</td>
        <td>{{ brand.description }}</td>
        <td class="text-center">
          <a @click="openModal(brand._id)" href="#" class="me-3"><PencilSvg></PencilSvg></a>
          <a @click="deleteBrand(brand._id)" href="#"><TrashSvg></TrashSvg></a>
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
    <template #content><FormBrand :brand="state.brand" @modal-close="closeModal"></FormBrand></template>
  </ModalComponent>
</div>
</template>