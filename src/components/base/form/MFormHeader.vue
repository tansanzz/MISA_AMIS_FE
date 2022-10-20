<template>
  <div class="form__header">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.form__header {
  margin: 32px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.heading-left {
  display: flex;
}

.heading-left span {
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}

.heading-left span input {
  width: 18px;
  height: 18px;
}

.heading-left span div {
  padding-left: 10px;
  /* display:inline-block; */
}

.heading-right {
  display: flex;
  gap: 12px;
}
</style>
