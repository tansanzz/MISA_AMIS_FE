<template>
  <div class="form">
        <slot />
  </div>
</template>

<script>
import MFormHeader from './MFormHeader.vue'
import MFormBody from './MFormBody.vue'
import MFormFooter from './MFormFooter.vue'

export { MFormHeader, MFormBody, MFormFooter };
export default {};
</script>

<style scoped>
.form {
  background-color: #fff;
  padding: 0 32px;
  min-width: 900px;
  max-width: 900px;
  width: 900px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
