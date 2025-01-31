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

const { store } = storeToRefs(categoryStore);

// Modal window state
const state = reactive({
  modal: null,
  modalHeader: null,
  category: {},
});

onMounted(() => {
  state.modal = new Modal('#modal', {});
})

function openModal(id) {
  if (id) {
    state.modalHeader = 'Edit category';
    state.category = categoryStore.store.categories.find((item) => item._id === id);
  } else {
    state.modalHeader = 'Create category';
    state.category = {
      'name': '',
      'description': '',
    };
  }
  state.modal.show();
}

const closeModal = () => state.modal?.hide();

function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    categoryStore.deleteCategory(categoryId);
  }
}
</script>

<template>
  <div id="page-content-wrapper" class="p-3">
    <Alert :message="store.message.value" :type="store.message.type" />
    <h1 class="float-start">Category list</h1>
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
        <tr v-for="(category, index) in store.categories" :key="category._id">
          <td>{{ index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td class="text-center">
            <a @click="openModal(category._id)" href="#" class="me-3"><PencilSvg /></a>
            <a @click="deleteCategory(category._id)" href="#"><TrashSvg /></a>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="store.isLoading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <ModalComponent id="modal" @modal-close="closeModal">
      <template #header>{{ state.modalHeader }}</template>
      <template #content><FormCategory :category="state.category" @modal-close="closeModal" /></template>
    </ModalComponent>
  </div>
</template>