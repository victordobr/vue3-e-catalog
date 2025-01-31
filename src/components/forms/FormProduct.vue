<script setup>
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useProductStore } from "@/stores/useProductStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";
import { Form, Field, useForm } from 'vee-validate';
import { watch } from "vue";
import * as yup from "yup";

const props = defineProps(['product']);
const emits = defineEmits(['modal-close']);

const categoryStore = useCategoryStore();
const brandStore = useBrandStore();

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    image: yup.string().required('Image url is required'),
    price: yup.string().required('Price is required'),
    categoryId: yup.string().required('Category is required'),
    brandId: yup.string().nullable(),
  })
});

const [title] = defineField('title');
const [description] = defineField('description');
const [image] = defineField('image');
const [price] = defineField('price');
const [categoryId] = defineField('categoryId');
const [brandId] = defineField('brandId');

watch(
    () => props.product,
    (newProduct) => {
      if (newProduct) {
        resetForm({ values: newProduct });
      }
    },
    { deep: true }
);

const onSubmit = handleSubmit(values => {
  const productStore = useProductStore();

  const productFn = props.product._id ? productStore.updateProduct : productStore.createProduct;
  productFn(values);
  emits('modal-close');
});
</script>

<template>
  <Form @submit="onSubmit">
    <div class="mb-3">
      <label for="product-form-title" class="form-label">Title</label>
      <Field name="title"
             v-model="title"
             type="text"
             class="form-control"
             id="product-form-title"
             placeholder="Product title"
             :class="{ 'is-invalid': errors.title }"/>
      <div class="invalid-feedback">{{ errors.title }}</div>
    </div>
    <div class="mb-3">
      <label for="product-form-description" class="form-label">Description</label>
      <Field as="textarea"
             name="description"
             v-model="description"
             class="form-control"
             id="product-form-description"
             rows="4"
             :class="{ 'is-invalid': errors.description }"/>
      <div class="invalid-feedback">{{ errors.description }}</div>
    </div>
    <div class="mb-3">
      <label for="product-form-image" class="form-label">Image url</label>
      <Field name="image"
             v-model="image"
             type="text"
             class="form-control"
             id="product-form-image"
             placeholder="Product image url"
             :class="{ 'is-invalid': errors.image }"/>
      <div class="invalid-feedback">{{ errors.image }}</div>
    </div>
    <div class="mb-3">
      <label for="product-form-price" class="form-label">Price</label>
      <Field name="price"
             v-model="price"
             type="number"
             class="form-control"
             id="product-form-price"
             placeholder="Product price"
             :class="{ 'is-invalid': errors.price }"/>
      <div class="invalid-feedback">{{ errors.price }}</div>
    </div>
    <div class="mb-3">
      <label for="product-form-category" class="form-label">Category</label>
      <Field name="categoryId"
             as="select"
             v-model="categoryId"
             class="form-select"
             id="product-form-category"
             :class="{ 'is-invalid': errors.categoryId }">
        <option v-for="category in categoryStore.store.categories" :value="category._id">{{ category.name }}</option>
      </Field>
      <div class="invalid-feedback">{{ errors.categoryId }}</div>
    </div>
    <div class="mb-3">
      <label for="product-form-brand" class="form-label">Brand</label>
      <Field name="brandId"
             as="select"
             v-model="brandId"
             class="form-select"
             id="product-form-brand"
             :class="{ 'is-invalid': errors.brandId }">
        <option value="">No brand</option>
        <option v-for="brand in brandStore.store.brands" :value="brand._id">{{ brand.name }}</option>
      </Field>
      <div class="invalid-feedback">{{ errors.brandId }}</div>
    </div>
    <button class="btn btn-success" :disabled="!(title && image && price && categoryId)">
      Save
    </button>
  </Form>
</template>