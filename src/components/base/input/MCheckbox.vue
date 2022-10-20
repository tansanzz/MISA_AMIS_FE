<template>
  <label class="con-checkbox">
    <input
      @click="handleClickInput"
      type="checkbox"
      class="checkbox--input"
      :checked="modelValue"
    />
    <span class="checkbox" :class="{ 'checkbox-checked-true': modelValue }">
      <span class="ms-checkbox-check-disabled-false ms-checkbox--check">
        <div v-if="modelValue" class="icon icon-16 icon-checkbox-active"></div>
      </span>
    </span>
  </label>
</template>

<script>
import { toRefs } from "vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { modelValue } = toRefs(props);

    /**********************
     * Xử lí khi nhấn vào checkbox
     * NXTSAN 19-9-2022
     */
    const handleClickInput = () => {
      context.emit("update:modelValue", !modelValue.value);
    };
    return {
      handleClickInput,
    };
  },
};
</script>

<style>
.checkbox {
  top: 0;
  left: 0;
  transition: all 0.2s ease;
  transform: rotate(-90deg);
  cursor: pointer;
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #000000;
  background: #fff;
}

.checkbox-checked-true {
  border: 1px solid #2ca01c;
  transform: rotate(0deg);
}

.checkbox--input {
  position: absolute;
  width: 10%;
  height: 100%;
  opacity: 0;
  z-index: 200;
  cursor: pointer;
}

.con-checkbox {
  justify-content: center !important;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
