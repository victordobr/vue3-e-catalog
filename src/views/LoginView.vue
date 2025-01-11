<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '@/stores/useAuthStore.js';

const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

function onSubmit(values, { setErrors }) {
    const authStore = useAuthStore();
    const { username, password } = values;

    return authStore.login(username, password);
}
</script>

<template>
<div id="page-content-wrapper" class="p-3">
  <h1>Login</h1>
  <div class="alert alert-info mb-3">
      Username: test<br />
      Password: test
  </div>
  <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
    <div class="mb-3">
      <label for="login-form-username" class="form-label">Username</label>
      <Field name="username" type="text" id="login-form-username" class="form-control" :class="{ 'is-invalid': errors.username }" />
      <div class="invalid-feedback">{{errors.username}}</div>
    </div>
    <div class="mb-3">
      <label for="login-form-password">Password</label>
      <Field name="password" type="password" id="login-form-password" class="form-control" :class="{ 'is-invalid': errors.password }" />
      <div class="invalid-feedback">{{errors.password}}</div>
    </div>
    <div class="mb-3">
      <button class="btn btn-primary" :disabled="isSubmitting">
        <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
        Login
      </button>
    </div>
  </Form>
</div>
</template>
