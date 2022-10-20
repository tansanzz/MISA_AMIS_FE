<template>
  <div :class="['icon-input', { 'icon-input--focus': focused }]">
    <input
      ref="refInput"
      :placeholder="placeholder"
      type="text"
      :class="['input', { 'input-icon': isIconInput }]"
      :value="modelValue"
      @input="handleInput($event)"
    />
    <div class="icon-wrapper" @click="handleClickSearch">
      <div v-if="isIconInput" class="icon icon-16 icon-search"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, toRefs } from "vue";

const TYPE_SEARCH = "search";
export default {
  setup(props, context) {
    const { text } = toRefs(props);
    const focused = ref(false);
    const isIconInput = ref(false);
    const refInput = ref(null);
    const { type } = toRefs(props);
    if (type.value === TYPE_SEARCH) isIconInput.value = true;
    const inputText = ref("");

    /******************************
     * Xử lý nhập dữ liệu
     * NXTSAN 16-09-2022
     */
    const handleInput = (event) => {
      // inputText.value = event.target.value;
      context.emit("update:modelValue", event.target.value);
      context.emit("search", event.target.value);
    };

    /******************************
     * Xử lý nhấn button tìm kiếm
     * NXTSAN 16-09-2022
     */
    const handleClickSearch = () => {
      context.emit("search", inputText.value);
    };

    return {
      inputText,
      refInput,
      isIconInput,
      focused,
      handleInput,
      handleClickSearch,
    };
  },
  props: {
    modelValue: String,
    label: String,
    required: Boolean,
    type: String,
    placeholder: String,
  },
};
</script>

<style scoped>
.icon-input.icon-input--focus {
  border: 1px solid #2ca01c;
}
.icon-input {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  justify-content: center;
  border: 1px solid #babec5;
  border-radius: 2px;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
}

.input {
  padding: 0 10px;
  height: var(--input-height);
  background-color: #fff;
  border: none;
  border-radius: 4px;
}

.input.input-icon {
  padding-left: 8px;
  padding-right: var(--input-height);
  width: 100%;
}

.icon-wrapper {
  cursor: pointer;
  position: absolute;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  height: var(--input-height);
  width: var(--input-height);
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0px;
}

.icon-wrapper .icon {
}
</style>
