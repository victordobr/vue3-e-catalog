<script setup>
import { useBrandStore } from "@/stores/useBrandStore.js";
import * as Yup from "yup";
import { Form, Field } from 'vee-validate';
import Alert from "@/components/Alert.vue";
import { ref } from "vue";

const props = defineProps(['brand']);
const emits = defineEmits(['modal-close']);

const brandStore = useBrandStore();

const error = ref('');

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
});

function onSubmit () {
  error.value = '';
  const brandFn = props.brand._id ? brandStore.updateBrand : brandStore.createBrand;

  brandFn(props.brand)
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
    <label for="brand-form-title" class="form-label">Name</label>
    <Field name="name" v-model="brand.name" type="text" class="form-control" id="brand-form-title" placeholder="Brand name" :class="{ 'is-invalid': errors.name }" />
    <div class="invalid-feedback">{{ errors.name }}</div>
  </div>
  <div class="mb-3">
    <label for="brand-form-description" class="form-label">Description</label>
    <Field as="textarea" name="description" v-model="brand.description" class="form-control" id="brand-form-description" rows="4" :class="{ 'is-invalid': errors.description }" />
    <div class="invalid-feedback">{{ errors.description }}</div>
  </div>
  <button class="btn btn-success" :disabled="isSubmitting">
    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
    Save
  </button>
</Form>
</template>