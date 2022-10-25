<template>
  <div class="combo-button-wrapper">
    <button class="m-btn m-outline-btn">
      {{ text }}
    </button>

    <div
      class="icon-wrapper"
      @click="isShow = !isShow && data.length > 0"
      ref="refButton"
    >
      <div class="icon icon-16 icon-arrow-down"></div>
    </div>

    <Transition name="button">
      <div v-if="data.length > 0" class="items" v-show="isShow" ref="refItems">
        <div class="item" @click="batchDelete">Xoá</div>
      </div>
    </Transition>
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

.button-enter-active,
.button-leave-active {
  transition: ease 0.2s;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.combo-button-wrapper .m-btn {
  outline: none;
  border: 2px solid #000;
  border-radius: 40px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
  font-size: 14px;
  font-weight: 500;
  line-height: unset;
  padding-right: 0;
}

.icon-wrapper {
  border-radius: 40px;
  border: 2px solid #000;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
  display: flex;
  align-items: center;
}

.icon-wrapper .icon {
  margin-left: 6px;
  margin-right: 12px;
}

.items {
  border: 1px solid #000;
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 1px;
  z-index: 3;
  background-color: #fff;
  border: 1px solid #babec5;
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
