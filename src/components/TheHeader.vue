<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore.js";

const authStore = useAuthStore();

</script>

<template>
  <!-- Top navigation-->
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li v-show="authStore.user" class="nav-item">
            <RouterLink to="/products" class="nav-link">Products</RouterLink>
          </li>
          <li v-show="authStore.user" class="nav-item">
            <RouterLink to="/categories" class="nav-link">Categories</RouterLink>
          </li>
          <li v-show="authStore.user" class="nav-item">
            <RouterLink to="/brands" class="nav-link">Brands</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
          <li v-show="!authStore.user" class="nav-item">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
          </li>
          <li v-show="authStore.user" class="nav-item">
            <a href="#" @click="authStore.logout()" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>