<template>
  <div class="form__footer">
        <slot />
  </div>
</template>

<script>
export default {};
</script>

<style>
.form__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0;
}

.form__footer .action-button__right {
  display: flex;
  gap: 12px;
}</style>
