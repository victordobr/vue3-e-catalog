<script setup>
defineProps(['message', 'type']);
</script>

<template>
  <Transition>
    <div v-if="message" class="alert" :class="'alert-' + type" role="alert">
      {{ message }}
    </div>
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>