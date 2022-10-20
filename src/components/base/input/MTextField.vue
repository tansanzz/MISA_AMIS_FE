<template>
  <div class="text-field">
    <slot />
  </div>
</template>

<script>
import { ref, onMounted, toRefs } from "vue";
import MLabel from "./MLabel.vue";
import MInput from "./MInput.vue";
import MRadio from "./MRadio.vue";
import MCombobox from "./MCombobox.vue";
import MDatePicker from './MDatePicker.vue';
import MComboboxV2 from './MComboboxV2.vue';

export { MLabel, MInput, MRadio, MCombobox, MDatePicker, MComboboxV2 };
export default {
  props: {
    label: String,
    required: {
      type: Boolean,
      default: false,
    },
    handleValidate: Function,
    modelValue: String,
    readOnly: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    error: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    errorMessage: String,
  },
  setup(props) {
    const inputRef = ref(null);
    const { focus } = toRefs(props);

    onMounted(() => {
      if (focus.value) {
        inputRef.value.focus();
      }
    });
    return {
      inputRef,
    };
  },
};
</script>
<style>
@import "../../../styles/base/text-field.css";
.text-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 8px;
}
</style>
