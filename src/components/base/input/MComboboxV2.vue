<template>
  <div class="combo-box combo-box--medium">
    <input
      ref="refInput"
      type="text"
      :class="['combo-box__input', { 'combo-box__input--error': error }]"
      :tabindex="tabindex"
      autocomplete="off"
      v-model="item"
      @input="handleInput"
      @keydown="handlePressKey"
      @blur="this.$emit('blur')"
    />
    <div v-if="error" class="combo-box__input--error-message">
      {{ error }}
    </div>
    <button
      class="combo-box__button"
      ref="buttonRef"
      tabindex="-1"
      @click="handleShowItems"
    >
      <div class="icon icon-16 icon-chevron-down"></div>
    </button>
    <div v-if="isShowItems" ref="itemsRef" class="combo-box__items-wrapper">
      <div class="combo-box__items--header">
        <table cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th style="width: 100px; text-align: center">Mã đơn vị</th>
              <th style="width: 250px; text-align: left">Tên đơn vị</th>
            </tr>
          </thead>
        </table>
      </div>
      <table class="combo-box__items--body" cellspacing="0" cellpadding="0">
        <tbody
          class="combo-box__items"
          :style="{ minHeight: 32 * items.length + 'px' }"
        >
          <div
            ref="refItems"
            :class="[
              'combo-box__item-wrapper',
              {
                'seleted-item':
                  filteredItem.id == selectedItem(currentItemIndex).id,
              },
            ]"
            v-for="filteredItem in items"
            :key="filteredItem.id"
          >
            <!-- , index :style="{
              transform:
                'translateY(' + 32 * (true? index - currentItemIndex : index) + 'px)',
            }" -->
            <tr
              class="combo-box__item"
              @click="handleSelectItem(filteredItem.id, filteredItem.value)"
            >
              <td style="width: 100px; text-align: center">
                {{ filteredItem.code }}
              </td>
              <td style="width: 250px; text-align: left">
                {{ filteredItem.value }}
              </td>
            </tr>
          </div>
        </tbody>
      </table>
      <div class="combo-box__items--footer">
        <div class="icon icon-16 icon-green-pen"></div>
        <div class="text">Cập nhật cơ cấu tổ chức</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { onBeforeMount, onUnmounted, ref, toRefs, watch, computed } from "vue";
export default {
  props: {
    tabindex: Number,
    id: String,
    value: String,
    data: Array,
    error: String,
  },
  setup(props, context) {
    const { data, value } = toRefs(props);
    const items = computed(() => {
      var items = [];
      if (data.value) {
        data.value.forEach((item) => {
          items.push({
            id: item["DepartmentID"],
            code: item["DepartmentCode"],
            value: item["DepartmentName"],
          });
        });
      }
      return items;
    });
    const item = computed({
      get() {
        if (value.value) return value.value;
        return "";
      },
      set(value) {
        context.emit("update:value", value);
      },
    });
    const errorMessages = ref([]);
    const isShowItems = ref(false);
    const itemsRef = ref(null);
    const buttonRef = ref(null);
    const refInput = ref(null);
    const refItems = ref(null);
    const currentItemIndex = ref(0);

    /******************************
     * Xử lý bấm chuột
     * NXTSAN 03-10-2022
     */
    const clickOutside = (event) => {
      if (!itemsRef.value) return;
      if (
        itemsRef.value &&
        !itemsRef.value.contains(event.target) &&
        buttonRef.value &&
        !buttonRef.value.contains(event.target) &&
        refInput.value &&
        !refInput.value.contains(event.target)
      ) {
        isShowItems.value = false;
      }
    };

    onBeforeMount(() => {
      document.addEventListener("mousedown", clickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("mousedown", clickOutside);
    });

    /**********************
     * Xem sự thay đổi người thông tin nhập thay đổi
     * NXTSAN 19-9-2022
     */
    watch(item, () => {});

    const handleInput = () => {
      context.emit("input", item.value);
      handleFilterItems();
      checkValidInput(item.value);
    };

    /******************************
     * Xử lý lọc dữ liệu
     * NXTSAN 03-10-2022
     */
    const handleFilterItems = () => {
      isShowItems.value = true;
      for (let index = 0; index < items.value.length; index++) {
        const _item = items.value[index];
        if (
          toNonAccentVietnamese(_item.value)
            .toLowerCase()
            .includes(toNonAccentVietnamese(item.value).toLowerCase().trim())
        ) {
          currentItemIndex.value = index;
          return;
        }
      }
      if (items.value[0]) currentItemIndex.value = 0;
    };

    /******************************
     * Xử lý chọn dữ liệu
     * NXTSAN 03-10-2022
     */
    const handleSelectItem = (id, value) => {
      item.value = value;
      isShowItems.value = false;
      context.emit("update:id", id);
      context.emit("input", item.value);
      context.emit("blur");
      refInput.value.focus();
    };

    const selectedItem = (index) => {
      if (!items.value[index]) return {};
      const _selectedItem = {
        id: items.value[index].id,
        value: items.value[index].value,
      };
      return _selectedItem;
    };

    /******************************
     * Danh sách các key code sử dụng trong combobox
     * NXTSAN 03-10-2022
     */
    const keyCode = {
      DOWN: 40,
      UP: 38,
      ENTER: 13,
      TAB: 9,
    };

    /******************************
     * Xử lý khi nhấn phím trong combobox
     * NXTSAN 03-10-2022
     */
    const handlePressKey = (event) => {
      const _keyCode = event.keyCode;
      switch (_keyCode) {
        case keyCode.DOWN:
          if (!isShowItems.value) {
            handleFilterItems();
            isShowItems.value = true;
            return;
          }
          currentItemIndex.value++;
          if (currentItemIndex.value > items.value.length - 1)
            currentItemIndex.value = 0;
          break;
        case keyCode.UP:
          currentItemIndex.value--;
          if (currentItemIndex.value < 0)
            currentItemIndex.value = items.value.length - 1;
          break;
        case keyCode.ENTER:
          console.log("enter");
          item.value = items.value[currentItemIndex.value].value;
          isShowItems.value = false;
          context.emit("update:id", items.value[currentItemIndex.value].id);
          break;
        case keyCode.TAB:
          isShowItems.value = false;
          break;
        default:
          break;
      }
    };

    /********************************
     * Kiểm tra đầu vào có hợp lệ không
     * NXTSAN 03-10-2022
     */
    const checkValidInput = (text) => {
      if (
        toNonAccentVietnamese(
          items.value[currentItemIndex.value].value
        ).toLowerCase() !== toNonAccentVietnamese(text).toLowerCase()
      ) {
        return false;
      } else {
        return true;
      }
    };

    /******************************
     * Hiện danh sách item
     * NXTSAN 03-10-2022
     */
    const handleShowItems = () => {
      isShowItems.value = !isShowItems.value;
      if (isShowItems.value) refInput.value.focus();
    };

    /**********************
     * Chuyển tiếng việt sang tiếng anh
     * NXTSAN 19-9-2022
     */
    function toNonAccentVietnamese(str) {
      str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/Đ/g, "D");
      str = str.replace(/đ/g, "d");
      // Some system encode vietnamese combining accent as individual utf-8 characters
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
      return str;
    }

    return {
      handleInput,
      items,
      selectedItem,
      refInput,
      refItems,
      buttonRef,
      itemsRef,
      isShowItems,
      item,
      handleSelectItem,
      handlePressKey,
      handleFilterItems,
      currentItemIndex,
      handleShowItems,
      errorMessages,
    };
  },
};
</script>

<style>
.combo-box {
  position: relative;
  border-radius: 4px;
}

.combo-box.combo-box--small {
  height: 32px;
}

.combo-box.combo-box--medium {
  height: 36px;
}

.combo-box__input {
  width: 100%;
  height: inherit;
  padding-right: 56px !important;
  padding-left: 16px;
  border-radius: 4px;
  background-color: var(--input__background--normal);
  border: 1px solid var(--input__border--normal);
}

.combo-box__input:hover {
  background-color: var(--input__background--hover);
  border: 1px solid var(--input__border--hover);
}

.combo-box__input:focus {
  background-color: var(--input__background--focus);
  border: 1px solid var(--input__border--focus);
}

.seleted-item {
  background-color: rgba(80, 184, 60, 0.1);
}

.combo-box__items-wrapper {
  margin-top: 2px;
  border-radius: 4px;
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 999;
  border: 1px solid var(--input__border--normal);
  box-shadow: 0px 4px 16px rgba(23, 27, 42, 0.24);
}

.combo-box__items--body {
  display: block;
  width: 100%;
  background-color: #fff;
  border: none;
  max-height: 160px;
  overflow-y: overlay;
}

.combo-box__items {
  width: 100%;
  display: block;
  /* position: relative; */
}

.combo-box__items--body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.combo-box__items--body::-webkit-scrollbar-thumb {
  background: #b8bcc3;
}

.combo-box__items--body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.combo-box__items th {
  padding: 0 10px;
}

.combo-box__item-wrapper {
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 100%;
  height: 32px;
  line-height: 32px;
}

.combo-box__item {
  list-style-type: none;
  padding-left: 10px;
  height: 100%;
  line-height: 32px;
  cursor: pointer;
}

.combo-box__item-wrapper:hover,
.combo-box__item-wrapper:focus {
  background-color: #e9ebee;
  color: #000;
}

.combo-box__button {
  position: absolute;
  right: 0px;
  border: none;
  height: inherit;
  line-height: inherit;
  width: 40px;
  border-radius: 0 4px 4px 0px;
  border: 1px solid #e6e6e6;
  background-color: #fff;
  cursor: pointer;
  opacity: 0.5;
}

.combo-box__button .icon {
  margin: 0 auto;
}

.combo-box__button:hover {
  background-color: #d4d4d4;
  color: #000;
}

.combo-box__input--error {
  border-color: red !important;
}

.combo-box__input--error-message {
  /* display: block; */
  background: #f77;
  color: #fff;
  box-shadow: 2px 2px 2px 0 #d4d7dc;
  border-radius: 4px;
  padding: 4px 8px;
  max-width: 500px;
  position: absolute;
  top: calc(100%);
  left: 50%;
  transform: translate(-50%, 8px);
  min-width: 200px;
  display: none;
  /* color: var(--input__border--error);
  position: absolute;
  transform: translate(0, 4px); */
  font-size: 12px;
  width: 100%;
  z-index: 3;
}

.combo-box__input--error-message::after {
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

.combo-box__input--error:hover + .combo-box__input--error-message {
  display: block;
}

.combo-box__items--header {
  background: #eceef1;
}
.combo-box__items--header table {
  width: 100%;
}

.combo-box__items--header thead {
  height: 32px;
  color: #212121;
}

.combo-box__items--footer {
  height: 32px;
  display: flex;
  align-items: center;
  background-color: #ebedf0;
  padding: 0 11px;
}

.combo-box__items--footer .text {
  color: #35bf22;
  padding-right: 12px;
  padding-left: 9px;
}
</style>
