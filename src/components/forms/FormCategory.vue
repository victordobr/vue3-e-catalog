<script setup>
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { Form, Field, useForm } from 'vee-validate';
import { watch } from "vue";
import * as yup from "yup";

const props = defineProps(['category']);
const emits = defineEmits(['modal-close']);

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string(),
  })
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');

watch(
  () => props.category,
  () => {
    resetForm({ values: props.category });
  }
);

const onSubmit = handleSubmit(values => {
  const categoryStore = useCategoryStore();

  const categoryFn = props.category._id ? categoryStore.updateCategory : categoryStore.createCategory;
  categoryFn(values);
  emits('modal-close');
});
</script>

<template>
  <Form @submit="onSubmit">
    <div class="mb-3">
      <label for="category-form-title" class="form-label">Name</label>
      <Field name="name"
             v-model="name"
             v-bind="nameAttrs"
             type="text"
             class="form-control"
             id="category-form-title"
             placeholder="Category name"
             :class="{ 'is-invalid': errors.name }"/>
      <div class="invalid-feedback">{{ errors.name }}</div>
    </div>
    <div class="mb-3">
      <label for="category-form-description" class="form-label">Description</label>
      <Field as="textarea"
             name="description"
             v-model="description"
             v-bind="descriptionAttrs"
             class="form-control"
             id="category-form-description"
             rows="4"
             :class="{ 'is-invalid': errors.description }"/>
      <div class="invalid-feedback">{{ errors.description }}</div>
    </div>
    <button class="btn btn-success" :disabled="!name">
      Save
    </button>
  </Form>
</template>