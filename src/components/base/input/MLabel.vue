<template>
  <span class="m-label-wrapper">
    <label class="m-label">
      <slot />
      <span v-show="required" class="m-label--required"> *</span>
    </label>
  </span>
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.m-label-wrapper .m-label {
  font-weight: 500;
  font-size: 14px;
}

.m-label-wrapper .m-label .m-label--required {
  color: var(--input__border--error);
}
</style>
