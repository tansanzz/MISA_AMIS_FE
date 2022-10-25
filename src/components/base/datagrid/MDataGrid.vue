<template>
  <div class="body">
    <div class="grid">
      <div class="table-header" ref="refTableBody">
        <table class="table" @scroll="scrollTable">
          <thead>
            <tr>
              <th class="th-viewer th-multi-checkall text-left">
                <div>
                  <MCheckbox v-model="isCheckAll" />
                </div>
              </th>
              <div style="display: contents">
                <th
                  v-for="column in data.columns"
                  :class="{
                    'text-center': column.position == 2,
                    'text-left': column.position == 1,
                    'text-right': column.position == 3,
                  }"
                  :title="column.tooltip"
                  :key="column.field"
                  :style="{ minWidth: column.width + 'px' }"
                  class="th-viewer"
                >
                  <span class="head-title sub-header">{{
                    column.fieldName
                  }}</span>
                </th>
              </div>
              <th
                style="min-width: 120px; width: 120px"
                class="th-viewer th-wiget text-right"
              >
                <span class="head-title sub-header">Chức năng</span>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-body" @scroll="scrollTable">
        <table class="table">
          <tbody>
            <tr
              class="tr-viewer"
              v-for="(row, index) in data.rows"
              :class="{ 'tr-select': row.isCheck }"
              :key="index"
              @click="handleClickRow(row, $event)"
              @dblclick="handleDblClickRow(row, $event)"
            >
              <td class="td-multi td-viewer">
                <MCheckbox
                  @click="check(index, row, $event)"
                  v-model="row.isCheck"
                  ref="refCheckbox"
                />
              </td>
              <td
                class="td-viewer"
                v-for="(column, index) in data.columns"
                :style="{ minWidth: column.width + 'px' }"
                :class="{
                  'text-left': column.position == 1,
                  'text-center': column.position == 2,
                  'text-right': column.position == 3,
                }"
                :key="index"
              >
                {{
                  column.type == "date"
                    ? formatDate(row[column.field], "dd/MM/YYYY")
                    : column.type == "gender"
                    ? formatGender(row[column.field])
                    : row[column.field]
                }}
              </td>
              <td class="td-wiget td-viewer text-center">
                <div class="dropdown">
                  <div
                    class="dropdown-text body-1"
                    @click="handleDblClickRow(row, $event)"
                  >
                    Sửa
                  </div>
                  <div class="dropdown-icon">
                    <button class="icon-wrapper">
                      <div
                        class="icon icon-16 icon-arrow-down--blue"
                        ref="refEditCell"
                        @click="handleClickEditCell(row, index)"
                      ></div>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <MPagination
        :totalRecord="data.totalRecord"
        :pageSizes="pageSizes"
        :pageSize="pageSize"
        :pageNumber="pageNumber"
        @paging="(pageIndex) => this.$emit('paging', pageIndex)"
        @changePageSize="(pageSize) => this.$emit('changePageSize', pageSize)"
      />
      <transition name="dropdown">
        <div
          v-if="isShowDropdownList"
          class="dropdown-list"
          ref="refDropdownList"
          :style="{
            top: dropdownListPos.vertical + 'px',
            left: dropdownListPos.horizontal + 'px',
          }"
        >
          <div
            class="dropdown--item"
            v-for="item in data.rowMode"
            :key="item.name"
            @click="item.handler(currentEditObject)"
          >
            {{ item.name }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import common from "@/utils/common.js";
import MCheckbox from "./../input/MCheckbox.vue";
import MPagination from "./../datagrid/MPagingation.vue";
import {
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  toRefs,
  watch,
} from "vue";
export default {
  components: {
    MCheckbox,
    MPagination,
  },
  props: {
    pagination: {
      type: Boolean,
      default: false,
    },
    selectedIndex: {
      type: Number,
    },
    checkboxSelection: {
      type: Boolean,
      default: false,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    initSelectedRows: {
      type: Array,
    },
    pageNumber: {
      type: Number,
    },
    pageSizes: {
      type: Array,
    },
    pageSize: {
      type: Number,
    },
  },
  emits: [
    "dblClickRow",
    "clickRow",
    "deleteRow",
    "changePageSize",
    "paging",
    "selectRow",
  ],
  setup(props, context) {
    const { data, selectedIndex, initSelectedRows, pageNumber, isReady } =
      toRefs(props);
    const { formatDate, formatGender } = common;
    const isCheckAll = ref(false);
    const isShowDropdownList = ref(false);
    const dropdownListPos = ref({ horizontal: Number, vertical: Number });
    const refEditCell = ref(null);
    const prevRow = ref();
    const currentEditObject = ref({});
    const refDropdownList = ref(null);

    /******************************
     * Khởi tạo những hàng được đánh dấu từ trước
     * NXTSAN 17-10-2022
     */
    const initCheckedSelectedRows = () => {
      for (const index in initSelectedRows.value) {
        var selectedIndex = -1;
        for (const key in data.value.rows) {
          const row = data.value.rows[key];
          if (row.EmployeeID === initSelectedRows.value[index].EmployeeID) {
            selectedIndex = key;
            break;
          }
        }
        if (selectedIndex > -1) {
          data.value.rows[selectedIndex].isCheck =
            initSelectedRows.value[index].isCheck;
        }
      }
    };

    watch(isReady, () => {
      initCheckedSelectedRows();
    });

    onUpdated(() => {});

    /******************************
     * Xử lý bấm chuột
     * NXTSAN 03-10-2022
     */
    const handleMouseDown = (event) => {
      if (!refDropdownList.value) return;
      if (
        refDropdownList.value &&
        !refDropdownList.value.contains(event.target) &&
        refEditCell.value &&
        !refEditCell.value[0].contains(event.target)
      ) {
        isShowDropdownList.value = false;
      }
    };

    /******************************
     * Xử lý scroll
     * NXTSAN 03-10-2022
     */
    const handleScroll = (event) => {
      var scrollTop = event.target.scrollTop;
      if (currentEditObject.value.index >= 0) {
        dropdownListPos.value.vertical =
          refEditCell.value[
            currentEditObject.value.index
          ].getBoundingClientRect().top + 25;
        dropdownListPos.value.horizontal =
          refEditCell.value[
            currentEditObject.value.index
          ].getBoundingClientRect().left - 100;
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", handleScroll, true);

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", handleScroll, true);
    });

    /**********************
     * Xử lí click row
     * NXTSAN 19-9-2022
     */
    const handleClickRow = (row, event) => {
      const el = event.target.parentElement;
      el.classList.add("tr-choose");
      if (prevRow.value != undefined)
        prevRow.value.classList.remove("tr-choose");
      prevRow.value = el;
      context.emit("clickRow", row);
    };

    /**********************
     * Xử lí double click row
     * NXTSAN 19-9-2022
     */
    const handleDblClickRow = (row, event) => {
      try {
        const el = event.target;
        if (
          !el.classList.contains("td-multi") &&
          !el.classList.contains("checkbox--input")
        ) {
          context.emit("dblClickRow", row);
        }
      } catch (error) {
        console.log(error);
      }
    };

    /**********************
     * Check và uncheck checkbox
     * NXTSAN 19-9-2022
     */
    const check = (index, row, event) => {
      if (data.value.rows[index].isCheck) {
        context.emit("selectRow", data.value.rows[index], "add");
      } else {
        context.emit("selectRow", data.value.rows[index], "remove");
      }
    };

    /**********************
     * Xử lý chức năng trong dữ liệu bảng
     * NXTSAN 19-9-2022
     */
    const handleClickEditCell = (row, index) => {
      try {
        currentEditObject.value = row;
        currentEditObject.value.index = index;
        dropdownListPos.value.vertical =
          refEditCell.value[index].getBoundingClientRect().top + 25;
        dropdownListPos.value.horizontal =
          refEditCell.value[index].getBoundingClientRect().left - 100;
        isShowDropdownList.value = !isShowDropdownList.value;
      } catch (error) {
        console.log(error);
      }
    };

    const refTableBody = ref(null);

    const scrollTable = (event) => {
      refTableBody.value.scrollLeft = event.target.scrollLeft;
    };

    return {
      refTableBody,
      refDropdownList,
      currentEditObject,
      refEditCell,
      check,
      handleClickRow,
      handleDblClickRow,
      handleClickEditCell,
      formatDate,
      formatGender,
      dropdownListPos,
      isShowDropdownList,
      isCheckAll,
      common,
      scrollTable,
    };
  },
  watch: {
    isCheckAll: {
      handler: function () {
        for (const row of this.data.rows) {
          row.isCheck = this.isCheckAll;
        }
        if (this.isCheckAll) {
          this.$emit("selectRow", this.data.rows);
          return;
        }
        this.$emit("selectRow", []);
      },
    },
  },
};
</script>

<style>
/* @import "../../../styles/base/data-table.css"; */

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.table {
  border-collapse: collapse;
}

.body {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.grid {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-header {
  overflow: hidden;
  position: relative;
  z-index: 1;
  min-height: 48px;
}

.table-header thead {
  display: block;
  height: 48px;
}

.table-body {
  overflow: overlay;
  height: calc(100% - var(--grid-header-height));
}

.table-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.table-body::-webkit-scrollbar-thumb {
  background: #b8bcc3;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.th-multi-checkall {
  left: 0;
  z-index: 1;
}

.tr-viewer.tr-select {
  background-color: #cee4cd;
}

.tr-viewer.tr-choose {
  background-color: #f2f2f2;
}

.th-viewer {
  border-bottom: 1px solid var(--l-border);
  height: var(--grid-header-height);
  vertical-align: middle;
  background-color: var(--table-header___background);
  position: sticky;
  top: 0;
  padding: 0 16px;
}

.th-viewer:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.th-wiget {
  border-right: none;
  position: -webkit-sticky;
  position: sticky;
  right: 0;
  border-left: 1px solid var(--l-border);
  border-bottom: 1px solid var(--l-border);
  top: 0;
  z-index: 1;
}

.th-wiget::after {
  content: "";
  height: var(--grid-header-height);
  position: absolute;
  border-left: 1px dotted var(--l-border);
  left: -1px;
  top: 0;
}

.tr-viewer {
  background-color: #fff;
}

.td-viewer {
  background-color: inherit;
  height: var(--grid-body-line-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--l-border);
  white-space: pre-wrap;
}

.td-viewer:nth-last-child(2),
.th-viewer:nth-last-child(1) {
  border-right: none !important;
}

.td-viewer:not(.td-multi) {
  border-right: 1px dotted var(--l-border);
}

.th-viewer:not(.th-multi-checkall) {
  border-right: 1px dotted var(--l-border);
}

.td-multi {
  background-color: inherit;
  position: sticky;
  left: 0;
}

.td-multi::after,
.th-multi-checkall::after {
  content: "";
  width: 1px;
  height: var(--grid-header-height);
  position: absolute;
  right: 0;
  top: 0;
  border-right: 1px dotted var(--l-border);
}

.th-multi-checkall input,
.td-multi input {
  vertical-align: middle;
  width: 18px;
  height: 18px;
}

.td-wiget {
  background-color: inherit;
  border-right: none;
  position: sticky;
  right: 0;
  border-left: 1px dotted var(--l-border);
  display: flex;
  justify-content: flex-end;
  min-width: 120px;
}

.td-wiget .dropdown {
  display: flex;
  align-items: center;
}

.td-wiget .dropdown .dropdown-text {
  color: #0075c0;
  text-align: right;
}

.td-wiget .dropdown .icon {
  padding: 0 5px;
}

.td-wiget .dropdown .dropdown-text,
.td-wiget .dropdown .icon:hover {
  cursor: pointer;
}

.dropdown-list {
  display: inline-block;
  position: fixed;
  z-index: 0;
  background-color: #fff;
  padding: 2px 1px;
  border-radius: 2px;
  border: 1px solid #babec5;
}

.dropdown-list .dropdown--item {
  float: left;
  clear: both;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 5px 10px;
  width: 100%;
  position: relative;
}

.dropdown-list .dropdown--item:hover {
  background-color: #a0e792;
}

.page-index > *:hover {
  cursor: pointer;
}

.checked {
  background-color: #e5f3ff !important;
}

.page-selected {
  font-weight: bold;
  border: 1px solid #e0e0e0;
}

.dropdown-icon {
  width: 46px;
  padding: 8px 10px;
  height: 36px;
  display: flex;
  align-items: center;
}

.dropdown-icon .icon-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background-color: transparent;
}

.dropdown-icon .icon-wrapper:focus {
  outline: 1px solid #0075c0;
}

.td-padding-left {
  width: 16px;
}
</style>
