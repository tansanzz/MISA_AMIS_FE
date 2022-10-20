<template>
  <div  
    class="tooltip-wrapper"
    @mouseover="handleHoverToolTip"
    @mouseleave="isShowToolTip = false"
  >
    <slot />
    <div v-if="isShowToolTip" class="tooltip-content">
      {{ text }}
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    text: String,
  },
  setup() {
    const isShowToolTip = ref(false);
    const toolTipWidth = ref();

     /******************************
     * Xử lý di chuột vào dữ liệu
     * NXTSAN 03-10-2022
     */
    const handleHoverToolTip = () => {
      isShowToolTip.value = true;
    };
    return {
      toolTipWidth,
      isShowToolTip,
      handleHoverToolTip,
    };
  },
};
</script>

<style>
.tooltip-wrapper {
  position: relative;
  width: max-content;
}

.tooltip-content {
  width: max-content;
  border-radius: 3px;
  padding: 4px 8px;
  background-color: #505050;
  color: #fff;
  max-width: 500px;
  box-shadow: 2px 2px 2px 0 #505050;
  position: absolute;
  top: calc(100% + 2px);
  left: 50%;
  transform: translate(-50%, 0px);
  z-index: 3;
}
</style>
