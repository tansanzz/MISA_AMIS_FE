<template>
  <button class="m-btn" ref="btnRef" :tabindex="tabindex">
    {{ text }}
  </button>
</template>

<script>
import MIconButton from "@/components/base/button/MIconButton.vue";
import MComboButton from "@/components/base/button/MComboButton.vue";
const PRIMARY = "primary";
const SECONDARY = "secondary";
const DANGER = "danger";
const addClass = (el, className) => {
  if (className) {
    el.classList.add(className);
  }
};
export { MIconButton, MComboButton };
export default {
  props: {
    variant: {
      type: String,
    },
    text: {
      type: String,
    },
    tabindex: {
      type: String,
      default: "-1",
    },
  },
  mounted() {
    switch (this.variant) {
      case PRIMARY:
        addClass(this.$refs.btnRef, "m-pri-btn");
        break;
      case SECONDARY:
        addClass(this.$refs.btnRef, "m-sub-btn");
        break;
      case DANGER:
        addClass(this.$refs.btnRef, "m-danger-btn");
        break;
      default:
        addClass(this.$refs.btnRef, "m-pri-btn");
        break;
    }
  },
};
</script>

<style scoped>
@import "@/styles/base/button.css";
.pri-btn:focus {
  background-color: #4c983d;
}

.sub-btn:focus {
  background-color: #dbdbdb;
}
</style>
