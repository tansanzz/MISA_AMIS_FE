<template>
  <div class="message-box-wrapper" ref="trapRef">
    <div class="message-box">
      <div class="message-box__header">
        <div class="message-box__header--title">{{ title }}</div>
        <div class="message-box__header--button" @click="this.$emit('close')">
          <div class="icon icon-24 icon-close"></div>
        </div>
      </div>
      <div class="message-box__body">
        <div v-for="message in messages" :key="message">{{ message }}</div>
      </div>
      <div class="message-box__footer">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import MessageboxEnum from "@/utils/enum/message-box";
import useFocusTrap from "@/utils/useFocusTrap";
export default {
  props: {
    title: String,
    messages: Object,
  },
  setup(props, context) {
    // Có: Lưu lại giữ liệu và đóng Form chi tiết.
    const handleYes = () => {
      context.emit("close", MessageboxEnum.YES);
    };
    // Không: Không lưu lại giữ liệu và đóng Form chi tiết.
    const handleNo = () => {
      context.emit("close", MessageboxEnum.NO);
    };

    const { trapRef } = useFocusTrap();

    const types = [
      { name: "information", icon: "icon-information" },
      { name: "exclamation", icon: "icon-exclamation" },
      { name: "question", icon: "icon-question" },
    ];

    for (const type of types) {
      if (props.type == type.name) {
        var icon = type.icon;
      }
    }

    onBeforeMount(() => {
      const tabindexElements = document.querySelectorAll("[tabindex]");
    });

    const test = () => {
      console.log(refFirstFocus);
    };

    return {
      test,
      icon,
      handleYes,
      handleNo,
      trapRef,
    };
  },
};
</script>

<style>
.message-box-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 4;
}

.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  max-width: 400px;
  padding: 24px;
  transition: all 0.2s;
  box-shadow: 0 5px 20px 0 rgb(0 0 0 / 10%);
  background: #fff;
  border-radius: 4px;
  border: 1px solid var(--l-border);
}

.message-box__header {
  display: flex;
  justify-content: space-between;
}

.message-box__header--title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.message-box__header--button {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.message-box__body {
  padding: 24px 0;
  font-size: 14px;
  text-align: left;
}

.message-box__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

dialog {
  background-color: rgb(255, 255, 255);
}
dialog[open]:not(:focus-within) {
  background-color: rgb(255, 255, 254);
  transition: background-color 0.01s ease;
}

/* Polyfill for Dialog on FF, Safari etc */
.no-dialog dialog {
  display: none;
}

.no-dialog dialog[open] {
  display: block;
}
</style>
