<template>
  <div
    :class="[
      'combobox',
      { 'combobox--small': size === sizeConst.SMALL },
      { 'combobox--medium': size === sizeConst.MEDIUM },
    ]"
  >
    <input
      type="text"
      :class="['input combobox__input', { 'input--error': error }]"
      v-model="textInput"
      :tabindex="tabindex"
      :readonly="readonly"
      @focus="handleFocusInput"
      @input="handleInput"
      @keydown="handlePressUpDown($event)"
    />
    <div v-if="error" class="input--error-message">
      {{ errorMessage }}
    </div>
    <button
      :class="['button combobox__button', { 'input--error': error }]"
      @click="handleOpenDataList"
      @keydown="handlePressUpDown($event)"
      tabindex="-1"
    >
      <!-- <i class="fa-solid fa-chevron-down"></i> -->
      <div
        class="icon icon-16 icon-arrow-dropdown"
        :class="{ 'button-onclick': isShowListData }"
      ></div>
    </button>
    <transition name="listdata">
      <div
        v-if="isShowListData"
        :class="[
          'combobox__data',
          { 'combobox__data--bottom': placement === placementConst.BOTTOM },
          { 'combobox__data--top': placement === placementConst.TOP },
        ]"
        ref="combobox__data"
        v-clickoutside="handleHideDataList"
      >
        <a
          class="combobox__item"
          v-for="(item, index) in dataFilter"
          :class="{
            'combobox__item--focus': index == indexItemFocus,
            'combobox__item--selected': index == indexItemSelected,
          }"
          :key="item[this.propValue]"
          ref="itemFocusRef"
          :value="item[this.propValue]"
          @click="handleSelectItem(item, index)"
          @focus="saveItemFocus(index)"
          @keydown="handlePressUpDown($event, index)"
          @keyup="handlePressUpDown($event, index)"
          tabindex="1"
        >
          <span>{{ item[this.propText] }}</span>
          <div
            v-if="index == indexItemSelected"
            :class="[
              'combobox__item-icon',
              {
                'combobox__item--focus': index == indexItemFocus,
                'combobox__item--selected': index == indexItemSelected,
              },
            ]"
          >
            <div
              class="icon icon-24 icon-success-big"
              :class="{ 'button-onclick': isShowListData }"
            ></div>
          </div>
        </a>
      </div>
    </transition>
  </div>
</template>
<script>
/* eslint-disable */
/**
 * G??n s??? ki???n nh???n click chu???t ra ngo??i combobox data (???n data list ??i)
 * NVMANH (31/07/2022)
 */
const clickoutside = {
  mounted(el, binding, vnode, prevVnode) {
    el.clickOutsideEvent = (event) => {
      // N???u element hi???n t???i kh??ng ph???i l?? element ??ang click v??o
      // Ho???c element ??ang click v??o kh??ng ph???i l?? button trong combobox hi???n t???i th?? ???n ??i.
      if (
        !(
          (
            el === event.target || // click ph???m vi c???a combobox__data
            el.contains(event.target) || //click v??o element con c???a combobox__data
            el.previousElementSibling.contains(event.target)
          ) //click v??o element button tr?????c combobox data (nh???n v??o button th?? hi???n th???)
        )
      ) {
        // Th???c hi???n s??? ki???n t??y ch???nh:
        binding.value(event, el);
        // vnode.context[binding.expression](event); // vue 2
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  beforeUnmount: (el) => {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

function removeVietnameseTones(str) {
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
  str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
  str = str.replace(/??|??|???|???|??/g, "i");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
  str = str.replace(/???|??|???|???|???/g, "y");
  str = str.replace(/??/g, "d");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
  str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
  str = str.replace(/??|??|???|???|??/g, "I");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
  str = str.replace(/???|??|???|???|???/g, "Y");
  str = str.replace(/??/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
  // Remove extra spaces
  // B??? c??c kho???ng tr???ng li???n nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // B??? d???u c??u, k?? t??? ?????c bi???t
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

const keyCode = {
  Enter: 13,
  ArrowUp: 38,
  ArrowDown: 40,
  ESC: 27,
};

const placementConst = {
  TOP: "top",
  BOTTOM: "bottom",
};

const sizeConst = {
  SMALL: "small",
  MEDIUM: "medium",
};
import { onBeforeMount, onMounted, ref, toRefs, watchEffect } from "vue";
export default {
  directives: {
    clickoutside,
  },
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: String,
    size: {
      type: String,
      default: sizeConst.MEDIUM,
    },
    initialValue: Number,
    placement: {
      type: String,
      default: placementConst.BOTTOM,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: null,
    data: {
      type: Array,
      required: true,
    },
    propValue: String,
    propText: String,
    isLoadData: {
      type: Boolean,
      default: true,
    },
    tabindex: {
      type: Number,
      default: -1,
    },
  },
  setup(props, context) {
    const isShowListData = ref(false);
    const { data, propText, propValue, initialValue } = toRefs(props);
    const dataFilter = ref();
    const textInput = ref();
    const indexItemSelected = ref();
    const indexItemFocus = ref();
    const itemFocusRef = ref(null);

    onMounted(() => {
      data.value.forEach((item, index) => {
        if (item[propValue.value] == initialValue.value) {
          indexItemSelected.value = index;
          textInput.value = item[propText.value];
        }
      });
    });

    /*****************************
     * X??? l?? khi focus v??o input
     * NXTSAN 25/09/2022
     */
    const handleFocusInput = () => {
      context.emit("focus");
    };
    /**
     * L??u l???i index c???a item ???? focus
     * NVMANH (31/07/2022)
     */
    const saveItemFocus = (index) => {
      indexItemFocus.value = index;
    };

    /**
     * ???n danh s??ch item
     * NVMANH (31/07/2022)
     */
    const handleHideDataList = () => {
      isShowListData.value = false;
    };

    /**
     * Nh???n v??o button th?? hi???n th??? ho???c ???n List Item
     * NVMANH (31/07/2022)
     */
    const handleOpenDataList = () => {
      dataFilter.value = data.value;
      isShowListData.value = true;
    };

    /**
     * Click ch???n item trong danh s??ch
     * NVMANH (31/07/2022)
     */
    const handleSelectItem = (item, index) => {
      const text = item[propText.value];
      const value = item[propValue.value];
      textInput.value = text; // Hi???n th??? text l??n input.
      indexItemSelected.value = index;
      handleHideDataList();
      context.emit("getValue", value, text, index);
      context.emit("input");
    };

    /**
     * Nh???p text th?? th???c hi???n filter d??? li???u v?? hi???n th???
     * NVMANH (31/07/2022)
     */
    const handleInput = () => {
      dataFilter.value = data.value.filter((item) => {
        let text = removeVietnameseTones(textInput.value)
          .toLowerCase()
          .replace(" ", "");
        let textOfItem = removeVietnameseTones(item[propText.value])
          .toLowerCase()
          .replace(" ", "");
        return textOfItem.includes(text);
      });
      isShowListData.value = true;
    };

    /**
     * L???a ch???n item b???ng c??ch nh???n c??c ph??m l??n, xu???ng tr??n b??n ph??m
     * NVMANH (31/07/2022)
     */
    const handlePressUpDown = (event) => {
      var keyCodePress = event.keyCode;
      var elToFocus = null;
      switch (keyCodePress) {
        case keyCode.ESC:
          handleHideDataList();
          break;
        case keyCode.ArrowDown:
          handleOpenDataList();
          elToFocus = itemFocusRef.value[indexItemFocus.value + 1];
          if (
            indexItemFocus.value == null ||
            !elToFocus ||
            elToFocus.length == 0
          ) {
            indexItemFocus.value = 0;
          } else {
            indexItemFocus.value += 1;
          }
          break;
        case keyCode.ArrowUp:
          handleOpenDataList();
          elToFocus = itemFocusRef.value[indexItemFocus.value - 1];
          if (
            indexItemFocus.value == null ||
            !elToFocus ||
            elToFocus.length == 0
          ) {
            indexItemFocus.value = dataFilter.value.length - 1;
          } else {
            indexItemFocus.value -= 1;
          }
          break;
        case keyCode.Enter:
          elToFocus = itemFocusRef.value[indexItemFocus.value];
          elToFocus.click();
          isShowListData.value = true;
          break;
      }
    };

    return {
      handleInput,
      handleSelectItem,
      handleFocusInput,
      handleOpenDataList,
      handleHideDataList,
      itemFocusRef,
      saveItemFocus,
      handlePressUpDown,
      sizeConst,
      placementConst,
      textInput,
      dataFilter, // data ???? ???????c filter
      isShowListData, // Hi???n th??? list data hay kh??ng
      indexItemFocus, // Index c???a item focus hi???n t???i
      indexItemSelected, // Index c???a item ???????c selected
    };
  },
};
</script>
<style scoped>
.listdata-enter-active,
.listdata-leave-active {
  transition: opacity 0.2s ease;
}
.listdata-enter-from, .listdata-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.combobox {
  position: relative;
  border-radius: 4px;
}
.combobox.combobox--small {
  height: 24px;
  width: 40px;
}

.combobox.combobox--medium {
  height: 36px;
}

.combobox__input,
select {
  padding-left: 2px;
  width: 100%;
  height: inherit;
  flex: 1;
  /* padding-right: 56px !important; */
  /* padding-left: 12px; */
  border-radius: 4px;
  /* border: 1px solid #e6e6e6; */
  border: none;
}

.combobox__input:focus,
.combobox__input:focus ~ .combobox__button {
  border-color: #50b83c;
}

.combobox__button {
  width: 24px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0px;
  top: 0px;
  /* border: 1px solid #e6e6e6; */
  border-left: unset;
  height: inherit;
  border-radius: 0 4px 4px 0px;
  background-color: #fff;
  cursor: pointer;
  min-width: unset !important;
  opacity: 0.5;
  border: none;
}

.combobox__data {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  /* width: 100%; */
  width: 76px;
  right: 0;
  /* border: 1px solid #babec5; */
  border-radius: 4px;
  background-color: #fff;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(23, 27, 42, 0.24);
}

.combobox__data--bottom {
  top: calc(100% + 4px);
}

.combobox__data--top {
  bottom: calc(100% + 4px);
}

.combobox__item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  line-height: 36px;
  height: 36px;
  cursor: pointer;
  /* border: 1px solid #ccc; */
  outline: none;
  gap: 8px;
}

.combobox__item span {
  width: 36px;
  text-align: right;
  padding-right: 4px;
}

.combobox__item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.combobox__item:hover,
.combobox__item:focus,
.combobox__item--focus,
.combobox__item--hover {
  background-color: #e9ebee;
  color: #000;
}

.combobox__item--selected {
  pointer-events: none;
  color: #50b83c;
}

.input--error {
  border-color: red !important;
}

.input--error-message {
  display: none;
  background: #f77;
  color: #fff;
  box-shadow: 2px 2px 2px 0 #d4d7dc;
  border-radius: 3px;
  padding: 4px 8px;
  max-width: 500px;
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translate(-50%, -10px);
  min-width: 200px;
}

.input--error-message::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #f77;
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translate(-50%, 0);
}

.input--error:hover + .input--error-message {
  display: block;
}
</style>
