<script setup>
defineProps(['message']);
</script>

<template>
<Transition>
  <div v-if="message.value" class="alert" :class="'alert-' + message.type" role="alert">
    {{ message.value }}
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