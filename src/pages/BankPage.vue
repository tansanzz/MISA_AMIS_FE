<template>
  <MCheckbox v-model="isCheck" />
  <button @click="isCheck = !isCheck">Check</button>
</template>

<script>
import MCheckbox from "@/components/base/input/MCheckbox.vue";
import { ref } from "vue";
export default {
  components: {
    MCheckbox,
  },
  setup() {
    const isCheck = ref(false);
    return {
      isCheck,
    };
  },
};
</script>

<style></style>
