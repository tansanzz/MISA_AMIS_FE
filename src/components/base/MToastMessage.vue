<template>
  <div class="toast-message">
    <div class="toast-message__left">
      <div class="icon-wrapper">
        <div
          :class="[
            'icon icon-24',
            variant == toastMessage.SUCCESS
              ? toastMessage.ICON_SUCCESS
              : toastMessage.ICON_ERROR,
          ]"
        ></div>
      </div>
      <div class="toast-message-content">
        <slot />
      </div>
    </div>
    <div class="toast-message__right">
      <div class="icon-wrapper icon-wrapper-close">
        <div class="icon icon-12 icon-close-small"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, toRefs } from "vue";
import toastMessage from "@/utils/resource/toast-message";
export default {
  props: {
    variant: String,
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { variant } = toRefs(props);
    const toastMessageIcon = ref("");
    const getToastMessageIcon = () => {
      switch (variant.value) {
        case toastMessage.SUCCESS:
          toastMessageIcon.value = toastMessage.ICON_SUCCESS;
          break;
        case toastMessage.ERROR:
          toastMessageIcon.value = toastMessage.ICON_ERROR;
          break;
      }
    };
    getToastMessageIcon();

    return {
      toastMessage,
      toastMessageIcon,
    };
  },
};
</script>

<style scoped>
.toast-message {
  min-width: 450px;
  max-width: 650px;
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 4;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 16px 16px;
  justify-content: space-between;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.078);
}

.toast-message__left {
  display: flex;
}

.toast-message-content {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper-close {
  cursor: pointer;
}
</style>
