<template>
  <div class="dropdown"></div>
  
</template>

<script>
export default {
  props: {
    items: Array,
  },
  setup(props, context) {
    /**********************
     * Thực hiện khi chọn item
     * NXTSAN 14-10-2022
     */
    const changeItem = (event) => {
      context.emit("change", event.target.value);
    };
    return {
      changeItem,
    };
  },
};
</script>

<style scoped>
.dropdown {
  width: 40px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
}
</style>
