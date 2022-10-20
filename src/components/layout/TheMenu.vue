<template>
  <div class="logo-container">
    <a v-show="!isCollapse" href="" class="menu-container-option"></a>
    <a v-show="!isCollapse" href="" class="logo">
      <img
        class="img-icon"
        src="../../assets/img/Logo_Module_TiengViet_White.66947422.svg"
      />
    </a>
    <div v-show="isCollapse" class="header-icon icon icon-24 icon-three-stripes"></div>
  </div>
  <div class="menu-item-list">
    <MItemMenu
      text="Tổng quan"
      iconClass="icon icon-24 icon-sidebar-dashboard"
      link="dashboard"
    />
    <MItemMenu
      text="Tiền mặt"
      iconClass="icon icon-24 icon-sidebar-cash"
      link="cash"
    />
    <MItemMenu
      text="Tiền gửi"
      iconClass="icon icon-24 icon-sidebar-bank"
      link="bank"
    />
    <MItemMenu
      text="Mua hàng"
      iconClass="icon icon-24 icon-sidebar-purchase"
      link="purchase"
    />
    <MItemMenu
      text="Bán hàng"
      iconClass="icon icon-24 icon-sidebar-sale"
      link="dashboard"
    />
    <MItemMenu
      text="Quản lý hoá đơn"
      iconClass="icon icon-24 icon-sidebar-invoice"
      link="dashboard"
    />
    <MItemMenu
      text="Kho"
      iconClass="icon icon-24 icon-sidebar-stock"
      link="dashboard"
    />
    <MItemMenu
      text="Công cụ dụng cụ"
      iconClass="icon icon-24 icon-sidebar-tools"
      link="dashboard"
    />
    <MItemMenu
      text="Tài sản cố định"
      iconClass="icon icon-24 icon-sidebar-fixed-assets"
      link="dashboard"
    />
    <MItemMenu
      text="Thuế"
      iconClass="icon icon-24 icon-sidebar-tax"
      link="dashboard"
    />
    <MItemMenu
      text="Giá thành"
      iconClass="icon icon-24 icon-sidebar-price"
      link="dashboard"
    />
    <MItemMenu
      text="Tổng hợp"
      iconClass="icon icon-24 icon-sidebar-general"
      link="dashboard"
    />
    <MItemMenu
      text="Ngân sách"
      iconClass="icon icon-24 icon-sidebar-budget"
      link="dashboard"
    />
    <MItemMenu
      text="Báo cáo"
      iconClass="icon icon-24 icon-sidebar-report"
      link="dashboard"
    />
    <!-- <MItemMenu text="Phân tích tài chính" iconClass="icon icon-24 icon-sidebar-finance" link="dashboard"/>  -->
  </div>
</template>

<script>
import MItemMenu from "../base/MItemMenu.vue";
export default {
  components: {
    MItemMenu,
  },
  data() {
    return {
      isCollapse: false,
    }
  }
};
</script>

<style>
@import "../../styles/layouts/menu.css";
</style>
