<template>
  <div class="pagination">
    <div class="pagination-bar">
      <div class="left-pagination">
        <pre>Tổng số: <b>{{totalRecord}}</b> <span class="text-blur">bản ghi</span></pre>
      </div>
      <div class="right-pagination">
        <div class="paging-record-per-page text-blur">Số bản ghi/trang</div>
        <div class="record-in-page">
          <MCombobox
            readonly
            propText="text"
            propValue="value"
            placement="top"
            size="small"
            :data="pageSizesConvert"
            :initialValue="pageSize"
            @getValue="handleChangePageSize"
          />
        </div>
        <div class="page-button">
          <div class="prev-page">
            <div
              :class="[{ disableText: currentPageIndex == 1 }]"
              @click="handlePagination(currentPageIndex - 1)"
            >
              Trước
            </div>
          </div>
          <div class="page-number-wrapper">
            <div
              v-for="pageNumber in pageNumbers"
              :class="[
                'page-number',
                { pageSelected: currentPageIndex == pageNumber },
              ]"
              :key="pageNumber"
              @click="handlePagination(pageNumber)"
            >
              {{ pageNumber }}
            </div>
          </div>
          <div class="next-page">
            <div
              :class="[{ disableText: currentPageIndex == numOfPages }]"
              @click="handlePagination(currentPageIndex + 1)"
            >
              Sau
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import MCombobox from "@/components/base/input/MCombobox.vue";
import MDropdown from "@/components/base/input/MDropdown.vue";

import { computed, toRefs } from "vue";
export default {
  components: {
    MCombobox,
    MDropdown,
  },
  props: {
    totalRecord: Number,
    pageSizes: Array,
    pageSize: Number,
    pageNumber: Number,
  },
  setup(props, context) {
    const { totalRecord, pageSizes, pageSize, pageNumber } = toRefs(props);

    const currentPageIndex = computed(() => pageNumber.value);

    let numOfPages = computed(() =>
      Math.ceil(totalRecord.value / pageSize.value)
    );

    const pageSizesConvert = computed(() => {
      var tempPageSizes = [];
      for (const pagesize of pageSizes.value) {
        const object = {
          text: `${pagesize}`,
          value: pagesize,
        };
        tempPageSizes.push(object);
      }
      return tempPageSizes;
    });

    const pageNumbers = computed(() => {
      var array = [];
      const PAGE_NUMBER_START = 1;
      const PAGE_NUMBER_END = numOfPages.value;
      const PAGE_NUMBER_SPACE = 3;
      var start = Math.max(
        PAGE_NUMBER_START,
        currentPageIndex.value > PAGE_NUMBER_END - PAGE_NUMBER_SPACE + 1
          ? PAGE_NUMBER_END - PAGE_NUMBER_SPACE + 1
          : currentPageIndex.value - 1
      );
      var end = Math.min(
        currentPageIndex.value < PAGE_NUMBER_SPACE
          ? PAGE_NUMBER_START + PAGE_NUMBER_SPACE - 1
          : currentPageIndex.value + 1,
        PAGE_NUMBER_END
      );
      if (currentPageIndex.value >= PAGE_NUMBER_SPACE)
        array.push(PAGE_NUMBER_START);
      if (currentPageIndex.value > PAGE_NUMBER_SPACE) array.push("...");
      for (let index = start; index <= end; index++) {
        array.push(index);
      }
      if (currentPageIndex.value < PAGE_NUMBER_END - PAGE_NUMBER_SPACE + 1)
        array.push("...");
      if (currentPageIndex.value <= PAGE_NUMBER_END - PAGE_NUMBER_SPACE + 1)
        array.push(PAGE_NUMBER_END);
      return array;
    });

    /**********************
     * Xử lý phân trang
     * NXTSAN 19-9-2022
     */
    const handlePagination = (pageIndex) => {
      if (pageIndex >= 1 && pageIndex <= numOfPages.value) {
        context.emit("paging", pageIndex);
      }
    };

    /**********************
     * Xử lý thay đổi số lượng rows trong bảng
     * NXTSAN 19-9-2022
     */
    const handleChangePageSize = (value) => {
      context.emit("changePageSize", value);
    };

    return {
      pageNumbers,
      numOfPages,
      currentPageIndex,
      pageSizesConvert,
      handlePagination,
      handleChangePageSize,
    };
  },
};
</script>

<style>
@import "../../../styles/base/pagination.css";
</style>
