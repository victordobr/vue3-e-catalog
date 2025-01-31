<script setup>
import { useBrandStore } from "@/stores/useBrandStore.js";
import { Form, Field, useForm } from 'vee-validate';
import { watch } from "vue";
import * as yup from "yup";

const props = defineProps(['brand']);
const emits = defineEmits(['modal-close']);

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string(),
  })
});

const [name] = defineField('name');
const [description] = defineField('description');

watch(
    () => props.brand,
    (newBrand) => {
      if (newBrand) {
        resetForm({ values: newBrand });
      }
    },
    { deep: true }
);

const onSubmit = handleSubmit(values => {
  const brandStore = useBrandStore();

  const brandFn = props.brand._id ? brandStore.updateBrand : brandStore.createBrand;
  brandFn(values);
  emits('modal-close');
});

</script>

<template>
<Form @submit="onSubmit">
  <div class="mb-3">
    <label for="brand-form-title" class="form-label">Name</label>
    <Field name="name"
           v-model="name"
           type="text"
           class="form-control"
           id="brand-form-title"
           placeholder="Brand name"
           :class="{ 'is-invalid': errors.name }"/>
    <div class="invalid-feedback">{{ errors.name }}</div>
  </div>
  <div class="mb-3">
    <label for="brand-form-description" class="form-label">Description</label>
    <Field as="textarea"
           name="description"
           v-model="description"
           class="form-control"
           id="brand-form-description"
           rows="4"
           :class="{ 'is-invalid': errors.description }"/>
    <div class="invalid-feedback">{{ errors.description }}</div>
  </div>
  <button class="btn btn-success" :disabled="!name">
    Save
  </button>
</Form>
</template>