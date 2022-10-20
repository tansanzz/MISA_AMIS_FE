<template>
  <div class="combo-button-wrapper">
    <button class="m-btn m-outline-btn" >
      {{ text }}
    </button>
    <div class="icon-wrapper" @click="isShow = !isShow && data.length > 0" ref="refButton">
      <div class="icon icon-16 icon-chevron-down"></div>
    </div>
    <div v-if="data.length > 0" class="items" v-show="isShow" ref="refItems">
      <div class="item" @click="batchDelete">Xoá</div>
    </div>
  </div>
</template>
<script>
import { ref, onUnmounted } from "vue";
export default {
  props: {
    text: String,
    iconClass: String,
    data: Array,
  },
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
.combo-button-wrapper {
  display: flex;
  position: relative;
}

.combo-button-wrapper .m-btn {
  outline: none;
  border: 1px solid #000;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
  font-size: 14px;
  font-weight: 500;
}

.icon-wrapper {
  border-radius: 4px;
  border: 1px solid #000;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: flex;
  align-items: center;
}

.icon-wrapper .icon {
  margin: 0 12px;
}

.items {
  border: 1px solid #000;
  position: absolute;
  right: 0;
  top: 100%;
  border-radius: 4px;
  margin-top: 2px;
  z-index: 3;
  background-color: #fff;
}

.item {
  cursor: pointer;
  height: 32px;
  padding: 0 12px;
  min-width: 80px;
  line-height: 32px;
}

.item:hover {
  background-color: #ebebeb;
}
</style>
