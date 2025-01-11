<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["modal-close"]);

</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modal_label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal_label"><slot name="header"> default header </slot></h5>
          <button type="button" class="btn-close" aria-label="Close" @click="emit('modal-close')"></button>
        </div>
        <div class="modal-body">
          <slot name="content"> default content </slot>
        </div>
<!--        <div class="modal-footer">-->
<!--          <slot name="footer">-->
<!--            <button type="button" class="btn btn-primary">Save changes</button>-->
<!--          </slot>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>