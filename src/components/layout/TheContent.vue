<template>
  <div class="content">
    <div class="content__header">
      <div class="header__title">Nhân viên</div>
      <MButton id="btnAddEmployee" text="Thêm mới nhân viên" />
    </div>
    <div class="content__body">
      <div class="body__top">
        <input type="text" placeholder="Tìm theo mã, tên nhân viên" />
        <span class="icon--reload"></span>
      </div>
      <div class="data-wrapper">
        <table id="tblTable" class="table">
          <thead>
            <tr>
              <th class="text-align--left" prop-name="CheckBox">
                <input type="checkbox" name="" id="checkedAll" />
              </th>
              <th class="text-align--left" prop-name="EmployeeCode">
                MÃ NHÂN VIÊN
              </th>
              <th class="text-align--left" prop-name="FullName">
                TÊN NHÂN VIÊN
              </th>
              <th class="text-align--left" prop-name="GenderName">GIỚI TÍNH</th>
              <th
                class="text-align--center"
                format-date=""
                prop-name="DateOfBirth"
              >
                NGÀY SINH
              </th>
              <th class="text-align--right" prop-name="IdentityNumber">
                SỐ CMND
              </th>
              <th class="text-align--left" prop-name="PositionName">
                CHỨC DANH
              </th>
              <th class="text-align--left" prop-name="a">TÊN ĐƠN VỊ</th>
              <th class="text-align--right" prop-name="b">SỐ TÀI KHOẢN</th>
              <th class="text-align--left" prop-name="c">TÊN NGÂN HÀNG</th>
              <th class="text-align--left" prop-name="d">
                CHI NHÁNH TK NGÂN HÀNG
              </th>
              <th class="text-align--left" prop-name="Action">CHỨC NĂNG</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="paging-wrapper">
        <div class="paging-wrapper__left">
          Tổng số: <strong>1035</strong> bản ghi
        </div>
        <div class="paging-wrapper__right">
          <select name="" id="">
            <option value="">20 bản ghi trên 1 trang</option>
          </select>
          <div class="paging__left">
            <button>Trước</button>
          </div>
          <div class="paging__mid">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>...</button>
            <button>52</button>
          </div>
          <div class="paging__right">
            <button>Sau</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MButton from "../base/MButton.vue";

export default {
  components: {
    MButton,
  },
};
</script>

<style>
@import "../../styles/layouts/content.css";
@import "../../styles/components/icon.css";
@import "../../styles/patterns/paging.css";
</style>
