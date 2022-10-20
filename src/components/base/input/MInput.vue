<template>
  <div class="input-wrapper">
    <input
      type="text"
      :class="['m-input', { 'm-input--error': error }]"
      :readonly="readonly"
      :placeholder="placeholder"
      :value="modelValue"
      :tabindex="tabindex"
      @focus="handleFocus"
      @blur="$emit('blur')"
      @input="handleInput($event.target.value)"
    />
    <div v-if="error" class="input--error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref } from "vue";

export default {
  props: {
    error: String,
    name: String,
    modelValue: String,
    readonly: Boolean,
    placeholder: String,
    tabindex: {
      type: Number,
      default: -1,
    },
  },
  setup(props, context) {
    const errorMessages = ref([]);

    /********************
     * Xử lý nhập dữ liệu
     * NXTSAN 16-09-2022
     */
    const handleInput = (value) => {
      context.emit("update:modelValue", value);
    };

    /******************************
     * Xử lý focus dữ liệu
     * NXTSAN 16-09-2022
     */
    const handleFocus = () => {
      context.emit("focus");
    };

    return {
      errorMessages,
      handleFocus,
      handleInput,
    };
  },
};
</script>

<style scoped>
@import "../../../styles/base/text-field.css";
.m-input[type="text"] {
  min-width: 150px;
  width: 100%;
  height: 36px;
  padding: 0px 12px;
  border-radius: 4px;
  background-color: var(--input__background--normal);
  border: 1px solid var(--input__border--normal);
}

.m-input[type="text"]:hover {
  background-color: var(--input__background--hover);
  border: 1px solid var(--input__border--hover);
}

.m-input[type="text"]:focus {
  background-color: var(--input__background--focus);
  border: 1px solid var(--input__border--focus);
}

.m-input--error {
  background-color: var(--input__background--error) !important;
  border: 1px solid var(--input__border--error) !important;
}

.m-input:read-only {
  background-color: var(--input__background--readonly);
  border: 1px solid var(--input__border--readonly);
}

.input-wrapper {
  position: relative;
}

.input--error-message {
  display: none;
  color: #fff;
  position: absolute;
  font-size: 12px;
  box-shadow: 2px 2px 2px 0 #d4d7dc;
  border-radius: 4px;
  background: #f77;
  padding: 4px 8px;
  left: 50%;
  transform: translate(-50%, 8px);
  width: 100%;
  z-index: 3;
}

.input--error-message::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #f77;
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translate(-50%, 0);
}

.m-input--error:hover + .input--error-message {
  display: block;
}
</style>
