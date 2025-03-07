<script setup>
import { storeToRefs } from "pinia";
import PencilSvg from "@/components/svg/PencilSvg.vue";
import TrashSvg from "@/components/svg/TrashSvg.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { onMounted, reactive } from "vue";
import { Modal } from "bootstrap";
import Alert from "@/components/Alert.vue";
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import FormCategory from "@/components/forms/FormCategory.vue";

const categoryStore = useCategoryStore();

categoryStore.fetchCategories();

const {
  categories,
  isLoading,
  message,
} = storeToRefs(categoryStore);

// Modal window
const state = reactive({
  modal: null,
  modalHeader: null,
  category: {
    'name': '',
    'description': '',
  },
});

onMounted(() => {
  state.modal = new Modal('#modal', {});
})

function openModal(id) {
  if (id) {
    state.modalHeader = 'Edit category';
    state.category = Object.assign({}, categoryStore.categories.find((item) => item._id === id));
  } else {
    state.modalHeader = 'Create category';
    state.category = {
      'name': '',
      'description': '',
    };
  }
  state.modal.show();
}

function closeModal() {
  state.modal.hide();
}

function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    categoryStore.deleteCategory(categoryId);
  }
}

</script>

<template>
<div id="page-content-wrapper" class="p-3">
  <Alert :message="message"></Alert>
  <h1 class="float-start">Product list</h1>
  <button @click="openModal()" type="button" class="btn btn-outline-primary float-end">Create category</button>
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
      <tr v-for="(category, index) in categories">
        <td>{{ index + 1 }}</td>
        <td>{{ category.name }}</td>
        <td>{{ category.description }}</td>
        <td class="text-center">
          <a @click="openModal(category._id)" href="#" class="me-3"><PencilSvg></PencilSvg></a>
          <a @click="deleteCategory(category._id)" href="#"><TrashSvg></TrashSvg></a>
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
    <template #content><FormCategory :category="state.category" @modal-close="closeModal"></FormCategory></template>
  </ModalComponent>
</div>
</template>