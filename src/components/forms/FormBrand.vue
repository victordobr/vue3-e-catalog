<script setup>
import { useBrandStore } from "@/stores/useBrandStore.js";
import * as Yup from "yup";
import { Form, Field, useForm } from 'vee-validate';
import { watch } from "vue";
import * as yup from "yup";

const props = defineProps(['brand']);
const emits = defineEmits(['modal-close']);

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
  })
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');

watch(
    () => props.brand,
    () => {
      resetForm({ values: props.brand });
    }
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
           v-bind="nameAttrs"
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
           v-bind="descriptionAttrs"
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