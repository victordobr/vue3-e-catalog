<script setup>
import { useCategoryStore } from "@/stores/useCategoryStore.js";
import { useProductStore } from "@/stores/useProductStore.js";
import { useBrandStore } from "@/stores/useBrandStore.js";
import * as Yup from "yup";
import { Form, Field } from 'vee-validate';
import Alert from "@/components/Alert.vue";
import { ref } from "vue";

const props = defineProps(['product']);
const emits = defineEmits(['modal-close']);

const categoryStore = useCategoryStore();
const productStore = useProductStore();
const brandStore = useBrandStore();

const error = ref('');

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  image: Yup.string().required('Image url is required'),
  price: Yup.string().required('Price is required'),
  category: Yup.string().required('Category is required'),
  brand: Yup.string().nullable(),
});

function onSubmit () {
  error.value = '';
  const productFn = props.product._id ? productStore.updateProduct : productStore.createProduct;

  productFn(props.product)
    .then((r) => {
      emits('modal-close');
    })
    .catch((e) => {
      error.value = e.message;
    });
}
</script>

<template>
<Alert :message="error" type="danger"></Alert>
<Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
  <div class="mb-3">
    <label for="product-form-title" class="form-label">Title</label>
    <Field name="title" v-model="product.title" type="text" class="form-control" id="product-form-title" placeholder="Product title" :class="{ 'is-invalid': errors.title }" />
    <div class="invalid-feedback">{{ errors.title }}</div>
  </div>
  <div class="mb-3">
    <label for="product-form-description" class="form-label">Description</label>
    <Field as="textarea" name="description" v-model="product.description" class="form-control" id="product-form-description" rows="4" :class="{ 'is-invalid': errors.description }" />
    <div class="invalid-feedback">{{ errors.description }}</div>
  </div>
  <div class="mb-3">
    <label for="product-form-image" class="form-label">Image url</label>
    <Field name="image" v-model="product.image" type="text" class="form-control" id="product-form-image" placeholder="Product image url" :class="{ 'is-invalid': errors.image }" />
    <div class="invalid-feedback">{{ errors.image }}</div>
  </div>
  <div class="mb-3">
    <label for="product-form-price" class="form-label">Price</label>
    <Field name="price" v-model="product.price" type="number" class="form-control" id="product-form-price" placeholder="Product price" :class="{ 'is-invalid': errors.price }" />
    <div class="invalid-feedback">{{ errors.price }}</div>
  </div>
  <div class="mb-3">
    <label for="product-form-category" class="form-label">Category</label>
    <Field name="category" as="select" v-model="product.categoryId" class="form-select" id="product-form-category" :class="{ 'is-invalid': errors.category }">
      <option v-for="category in categoryStore.store.categories" :value="category._id">{{ category.name }}</option>
    </Field>
    <div class="invalid-feedback">{{ errors.category }}</div>
  </div>
  <div class="mb-3">
    <label for="product-form-brand" class="form-label">Brand</label>
    <Field name="brand" as="select" v-model="product.brandId" class="form-select" id="product-form-brand" :class="{ 'is-invalid': errors.brand }">
      <option value="">No brand</option>
      <option v-for="brand in brandStore.store.brands" :value="brand._id">{{ brand.name }}</option>
    </Field>
    <div class="invalid-feedback">{{ errors.brand }}</div>
  </div>
  <button class="btn btn-success" :disabled="isSubmitting">
    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
    Save
  </button>
</Form>
</template>