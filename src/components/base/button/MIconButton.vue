<template>
  <div class="icon-button-wrapper">
    <div class="icon-button">
      <!-- <slot /> -->
      <div :class="['icon', iconClass]"></div>
    </div>
  </div>
</template>
<script>
import { ref, onUnmounted } from "vue";
export default {
  props: ["text", "iconClass"],
  setup(props, context) {
    const isShow = ref(false);
    const refButton = ref(null);
    const refItems = ref(null);

    const batchDelete = () => {
      context.emit("batchDelete");
    };

    /******************************
     * Xử lý bấm chuột
     * NXTSAN 03-10-2022
     */
    const handleMouseDown = (event) => {
      if (!refButton.value) return;
      if (
        refButton.value &&
        !refButton.value.contains(event.target) &&
        refItems.value &&
        !refItems.value.contains(event.target)
      ) {
        isShow.value = false;
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleMouseDown);
    });

    return {
      refButton,
      refItems,
      isShow,
      batchDelete,
    };
  },
};
</script>

<style scoped>
@import "@/styles/base/button.css";
.icon-button-wrapper {
  display: inline-block;
  padding: 8px 8px;
  height: var(--primary-button-height);
  border-radius: 4px;
  text-align: center;
  line-height: var(--primary-button-height);
  background-color: rgba(80, 184, 60, 0.1);
}

.icon-button-wrapper .icon-button {
  width: 20px;
  height: 20px;
  position: relative;
}

.icon-button-wrapper .icon-button .icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(4027%)
    hue-rotate(65deg) brightness(102%) contrast(70%);
}

.icon-button-wrapper:hover {
  background-color: #e5f0e3;
}

.icon-button-wrapper .icon-button .icon:hover {
  filter: brightness(0) saturate(100%) invert(74%) sepia(15%) saturate(1832%)
    hue-rotate(62deg) brightness(89%) contrast(88%);
}

.icon-button-wrapper:active {
  background-color: #118044;
}

.icon-button-wrapper .icon-button .icon:active {
  filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%)
    hue-rotate(178deg) brightness(103%) contrast(104%);
}
</style>
