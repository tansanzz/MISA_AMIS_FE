<template>
  <div class="pagination">
    <div class="pagination-bar">
      <div class="left-pagination">
        <pre>Tổng số: <b>{{totalRecord}}</b> bản ghi</pre>
      </div>
      <div class="right-pagination">
        <div class="paging-record-per-page">Số bản ghi/trang</div>
        <div class="record-in-page">
          <MCombobox
            readonly
            propText="text"
            propValue="value"
            placement="top"
            size="small"
            :data="pageSizesConvert"
            :initialValue="pageSizesConvert[0].value"
            @getValue="handleChangePageSize"
          />
        </div>
        <div class="paging-count-record">
          <b
            >{{ (pageNumber - 1) * pageSize + 1 }} -
            {{ pageNumber * pageSize + 1 }}</b
          >
          bản ghi
        </div>
        <div class="page-button">
          <div class="prev-page">
            <div
              class="paging-icon-wrapper"
              @click="handlePagination(currentPageIndex - 1)"
            >
              <div
                :class="[
                  'icon icon-16 icon-chevron-left',
                  { disableText: currentPageIndex == 1 },
                ]"
              ></div>
            </div>
          </div>
          <div class="next-page">
            <div
              class="paging-icon-wrapper"
              @click="handlePagination(currentPageIndex + 1)"
            >
              <div
                :class="[
                  'icon icon-16 icon-chevron-right',
                  { disableText: currentPageIndex == numOfPages },
                ]"
              ></div>
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

import { computed, onBeforeMount, ref, toRefs, onUpdated } from "vue";
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
    const { totalRecord, pageSizes, pageSize } = toRefs(props);
    const currentPageIndex = ref(1);
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
    const paginationList = ref([]);

    onBeforeMount(() => {
      getPaginationList(1);
    });

    onUpdated(() => {
      console.log("re-render");
    });

    /**********************
     * Lấy danh sách index để phân trang
     * NXTSAN 19-9-2022
     */
    const getPaginationList = (pageIndex) => {
      paginationList.value = [];
      var start = Math.max(2, pageIndex);
      var end = Math.min(
        pageIndex <= 2 ? start + 1 : start + 2,
        numOfPages.value
      );
      if (end < numOfPages.value) paginationList.value.push(1);
      if (start > 2) paginationList.value.push("...");
      for (var i = start; i <= end; i++) {
        paginationList.value.push(i);
      }
      if (end < numOfPages.value) paginationList.value.push("...");
      if (end < numOfPages.value) paginationList.value.push(numOfPages.value);
    };

    /**********************
     * Xử lý phân trang
     * NXTSAN 19-9-2022
     */
    const handlePagination = (pageIndex) => {
      if (pageIndex >= 1 && pageIndex <= numOfPages.value) {
        getPaginationList(pageIndex);
        currentPageIndex.value = pageIndex;
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
      numOfPages,
      currentPageIndex,
      paginationList,
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
