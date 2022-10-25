<template>
  <div class="router-content">
    <div class="header-list">
      <div class="title-di heading-1">Nhân viên</div>
      <div class="header-button">
        <MButton
          variant="primary"
          text="Thêm mới nhân viên"
          @click="handleClickAddEmployee"
        />
      </div>
    </div>
    <div class="grid-list-data">
      <div class="grid-button-list">
        <MComboButton
          text="Thực hiện hàng loạt"
          @batchDelete="batchDelete"
          :data="selectedEmployees"
        />
        <div class="grid-button-list--right">
          <MIconInput
            type="search"
            placeholder="Tìm theo mã, tên nhân viên"
            @search="handleSearching"
            v-model="employeeFilter"
          />
          <m-tooltip
            text="Lấy lại dữ liệu"
            @click="refreshData"
            class="icon-36"
          >
            <MIconButton iconClass="icon-24 icon-refresh" />
          </m-tooltip>
          <m-tooltip
            class="icon-36"
            text="Xuất ra Excel"
            @click="exportData(employeeFilter)"
          >
            <MIconButton iconClass="icon-24 icon-excel" />
          </m-tooltip>
        </div>
      </div>
    </div>
    <div style="flex-grow: 1; position: relative">
      <MDataGrid
        v-if="isShowDatagrid"
        :checkboxSelection="true"
        :pagination="true"
        :selectedIndex="selectedIndex"
        :data="table"
        :initSelectedRows="selectedEmployees"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :pageNumber="pageNumber"
        :isReady="isDataReady"
        @clickRow="handleClickRow"
        @dblClickRow="handleDblClickRow"
        @deleteRow="handleDeleteRow"
        @paging="handlePaging"
        @changePageSize="handleChangePageSize"
        @selectRow="getSelectedEmployees"
      />
    </div>
  </div>
  <transition name="modal">
    <EmployeeDetail
      v-if="employeeDetail.isShow"
      @closeModal="closeEmployeeModal"
      :modalMode="employeeDetail.modalMode"
      :employeeModal="employeeModal"
      @showToastMessage="showToastMessage"
    />
  </transition>
  <transition name="message">
    <MMessageBox
      v-if="messageBox.isShow"
      :title="messageBox.title"
      :messages="messageBox.message"
      @close="messageBox.isShow = false"
    >
      <MButton
        v-for="button in messageBox.buttons"
        :key="button"
        :tabindex="button.tabindex"
        :variant="button.variant"
        :text="button.text"
        @click="button.callback"
      />
    </MMessageBox>
  </transition>
  <transition name="toast">
    <MToastMessage v-if="toast.isShow" :variant="toast.variant">
      <span :class="toast.textColor" style="white-space: pre">
        {{ toast.status }}
      </span>
      {{ toast.text }}
    </MToastMessage>
  </transition>
</template>
<script>
/* eslint-disable */
import MButton, {
  MIconButton,
  MComboButton,
} from "@/components/base/button/MButton.vue";
import MToastMessage from "@/components/base/MToastMessage.vue";
import toastMessage from "@/utils/resource/toast-message";
import { ToastMessage } from "@/utils/resource.js";
import MIconInput from "@/components/base/input/MIconInput.vue";
import MDataGrid from "@/components/base/datagrid/MDataGrid.vue";
import MExportExcel from "@/components/base/MExportExcel.vue";
import EmployeeDetail from "@/pages/cash-page/EmployeeDetail.vue";
import MTooltip from "@/components/base/tooltip/MTooltips.vue";
import FormEnum from "@/utils/enum/form";
import MessageBoxEnum from "@/utils/enum/message-box";
import KeyCodeEnum from "@/utils/enum/keycode";
import { formatDate, formatGender } from "@/utils/common.js";
import MMessageBox from "@/components/base/MMessageBox.vue";
import {
  ErrorValidate,
  ModalMessage,
  getMessageWithVariable,
  MessageBox,
} from "@/utils/resource.js";
import {
  ref,
  onBeforeMount,
  computed,
  reactive,
  watch,
  onUpdated,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import {
  filterEmployees,
  getEmployeeByID,
  deleteEmployee,
  batchDeleteEmployees,
  exportData,
} from "@/services/api/employeeApi";
const messageBoxModeEnum = {
  DELELE_ONE: "delete_one",
  DELELE_MANY: "delete_many",
};
import mitt from "mitt";

export default {
  components: {
    MExportExcel,
    MToastMessage,
    MMessageBox,
    MButton,
    MIconButton,
    MComboButton,
    MIconInput,
    MTooltip,
    MDataGrid,
    EmployeeDetail,
  },
  setup() {
    const emitter = mitt();
    const { state, commit } = useStore();
    const employees = reactive({
      Data: [],
      TotalCount: 0,
    });
    const table = reactive({
      rowMode: {
        duplicate: {
          name: "Nhân bản",
          handler: handleDuplicateRow,
        },
        delete: {
          name: "Xoá",
          handler: handleDeleteRow,
        },
        stopUsing: {
          name: "Ngừng sử dụng",
        },
      },
      columns: {
        EmployeeCode: {
          field: "EmployeeCode",
          fieldName: "Mã nhân viên",
          position: 1,
          width: 150,
        },
        FullName: {
          field: "FullName",
          fieldName: "Tên nhân viên",
          position: 1,
          width: 190,
        },
        Gender: {
          field: "Gender",
          fieldName: "Giới tính",
          callback: (value) => {
            return formatGender(value);
          },
          position: 1,
          type: "gender",
          width: 110,
        },
        DateOfBirth: {
          field: "DateOfBirth",
          fieldName: "Ngày sinh",
          callback: (value) => {
            return formatDate(value, "dd/MM/YYYY");
          },
          position: 2,
          type: "date",
          width: 150,
        },
        IdentityNumber: {
          field: "IdentityNumber",
          fieldName: "Số CMND",
          position: 1,
          width: 150,
          tooltip: "Số chứng minh nhân dân",
        },
        PositionName: {
          field: "PositionName",
          fieldName: "Chức danh",
          position: 1,
          width: 233,
        },
        DepartmentName: {
          field: "DepartmentName",
          fieldName: "Tên đơn vị",
          position: 1,
          width: 246,
        },
        BankAccount: {
          field: "BankAccount",
          fieldName: "Số tài khoản",
          position: 1,
          width: 154,
        },
        BankName: {
          field: "BankName",
          fieldName: "Tên ngân hàng",
          position: 1,
          width: 178,
        },
        BankPlace: {
          field: "BankPlace",
          fieldName: "Chi nhánh TK ngân hàng",
          position: 1,
          width: 250,
          tooltip: "Chi nhánh tài khoản ngân hàng",
        },
      },
      rows: computed(() => employees.Data),
      totalRecord: computed(() => employees.TotalCount),
      rowSelected: {},
    });
    const employeeFilter = ref("");
    const pageSizes = ref([20, 10, 5]);
    const pageSize = ref(20);
    const pageNumber = ref(1);
    const employeeDetail = ref({
      isShow: false,
      modalMode: FormEnum.MODE_ADD,
    });
    const messageInToast = computed(() => state.toastMessage);

    watch(messageInToast, () => {
      console.log(messageInToast.value);
    });
    const isDataReady = ref(false);
    const messageBox = reactive({
      mode: 1,
      title: "",
      message: "",
      isShow: false,
    });
    const employeeModal = ref({});
    const isShowDatagrid = ref(false);
    const selectedEmployees = ref([]);
    const toast = reactive({
      isShow: false,
      variant: toastMessage.SUCCESS,
      status: toastMessage.SUCCESS_TEXT,
      textColor: toastMessage.TEXT_GREEN,
      text: toastMessage.SUCCESS_DELETE_EMPLOYEE,
    });

    onBeforeMount(async () => {
      await handleLoadData();
    });

    onMounted(async () => {
      emitter.on("error", (e) => console.log(e));
    });

    const localPageSize = localStorage.getItem("pageSize");
    pageSize.value = parseInt(localPageSize);

    /****************************************
     * Thay đổi các thuộc tính cho MessageBox
     * NXTSAN 10-10-2022
     */
    const setMessageBoxMode = (messageBoxMode) => {
      // Thay đổi tiêu đề cho message box
      messageBox.title = ModalMessage.DataChange.delete[state.language];

      // Chuyển chế đố message box sang xoá 1
      if (messageBoxMode == messageBoxModeEnum.DELELE_ONE) {
        messageBox.messages = messageBox.message = [
          getMessageWithVariable(
            ErrorValidate.ConfirmDeleteEmployee[state.language],
            table.rowSelected.EmployeeCode
          ),
        ];
        // Cập nhật các button trong message box xoá 1
        messageBox.buttons = {
          close: {
            text: MessageBox.close.TEXT,
            tabindex: MessageBox.close.TABINDEX,
            variant: MessageBox.close.VARIANT,
            callback: () => {
              messageBox.isShow = false;
            },
          },
          // Button chấp nhận
          confirm: {
            text: MessageBox.confirmDelete.TEXT,
            tabindex: MessageBox.confirmDelete.TABINDEX,
            variant: MessageBox.confirmDelete.VARIANT,
            callback: handleDeleteEmployee,
          },
        };
      } else {
        // Thay đổi nội dung tin nhắn message box
        messageBox.message = [
          ErrorValidate.ConfirmDeleteEmployees[state.language],
        ];

        // Cập nhật các nút trong message box
        messageBox.buttons = {
          close: {
            text: MessageBox.close.TEXT,
            tabindex: MessageBox.close.TABINDEX,
            variant: MessageBox.close.VARIANT,
            callback: () => {
              messageBox.isShow = false;
            },
          },

          // Nút chấp nhận
          confirm: {
            text: MessageBox.confirmDelete.TEXT,
            tabindex: MessageBox.confirmDelete.TABINDEX,
            variant: MessageBox.confirmDelete.VARIANT,
            callback: handleBatchDeleteEmployees,
          },
        };
      }
    };

    /****************************************
     * Xử lí xoá nhiều nhân viên
     * NXTSAN 10-10-2022
     */
    const handleBatchDeleteEmployees = async () => {
      try {
        const deleteEmployeeIDs = getDeleteEmployeeIDs(selectedEmployees.value);
        const response = await batchDeleteEmployees(deleteEmployeeIDs);
        if (response.Success) {
          showToastMessage(
            toastMessage.SUCCESS,
            toastMessage.SUCCESS_TEXT,
            toastMessage.TEXT_GREEN,
            toastMessage.SUCCESS_DELETE_EMPLOYEE
          );
          selectedEmployees.value = [];
          handleLoadData();
        }
        messageBox.isShow = false;
      } catch (error) {
        showToastMessage(
          toastMessage.ERROR,
          toastMessage.ERROR_TEXT,
          toastMessage.TEXT_RED,
          ToastMessage.ERROR_SERVER
        );
      }
    };

    /****************************************
     * Xử lí xoá 1 nhân viên
     * NXTSAN 10-10-2022
     */
    const handleDeleteEmployee = async () => {
      try {
        const response = await deleteEmployee(table.rowSelected.EmployeeID);
        if (response.Success) {
          const index = selectedEmployees.value.indexOf(table.rowSelected);
          if (index > -1) {
            selectedEmployees.value.splice(index, 1);
            selectedEmployees.value = [...selectedEmployees.value];
          }
          showToastMessage(
            toastMessage.SUCCESS,
            toastMessage.SUCCESS_TEXT,
            toastMessage.TEXT_GREEN,
            getMessageWithVariable(
              toastMessage.SUCCESS_DELETE_A_EMPLOYEE,
              table.rowSelected.EmployeeCode
            )
          );
          handleLoadData();
        }
        messageBox.isShow = false;
      } catch (error) {
        showToastMessage(
          toastMessage.ERROR,
          toastMessage.ERROR_TEXT,
          toastMessage.TEXT_RED,
          getMessageWithVariable(
            toastMessage.ERROR_DELETE_A_EMPLOYEE,
            table.rowSelected.EmployeeCode
          )
        );
      }
    };

    /****************************************
     * Xử lí việc ẩn hiện Toast Message
     * NXTSAN 10-10-2022
     */
    var toastTimeout;
    const showToastMessage = (variant, status, textColor, text) => {
      // Gán biến thể cho toast message
      toast.variant = variant;

      // Gán trạng thái cho toast message
      toast.status = status;

      // Thay đổi màu chữ cho toast message
      toast.textColor = textColor;

      // Gán nội dung cho toast message
      toast.text = text;
      toast.isShow = true;
      const TIME = 5000;

      // Ẩn toast message sau 5s
      if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
      }
      toastTimeout = setTimeout(() => {
        toast.isShow = false;
      }, TIME);
    };

    /***********************
     * Xu ly lay nhan vien
     * NXTSAN 18-09-2022
     */
    const handleGetEmployees = async (pageSize, pageNumber, employeeFilter) => {
      try {
        // Lấy danh sách nhân viên theo bộ lọc
        employeeFilter = employeeFilter || "";
        const response = await filterEmployees(
          pageSize,
          pageNumber,
          employeeFilter
        );

        // Kiểm tra kết quả trả về
        if (response.Success) {
          // Nếu kết quả trả về thành công thì lấy dữ liệu thành công
          const data = response.Data;

          // Gán dữ liệu cho danh sách nhân viên
          employees.Data = data.Data;
          employees.TotalCount = data.TotalCount;
          return employees;
        }
      } catch (error) {
        showToastMessage(
          toastMessage.ERROR,
          toastMessage.ERROR_TEXT,
          toastMessage.TEXT_RED,
          toastMessage.SERVER_ERROR
        );
      }
    };

    watch(employees, (value) => {
      isShowDatagrid.value = true;
    });

    /**********************
     * Xu ly load du lieu
     * NXTSAN 18-09-2022
     */
    const handleLoadData = async () => {
      // Khởi chạy loading trước khi lấy dữ liệu
      commit("changeLoadStatus");
      pageNumber.value = 1;

      // Lấy dữ liệu
      await handleGetEmployees(
        pageSize.value,
        pageNumber.value,
        employeeFilter.value
      );

      // Kết thúc loading khi lấy dữ liệu xong
      commit("changeLoadStatus");
    };

    /**********************
     * Xu ly load du lieu
     * NXTSAN 18-09-2022
     */
    const refreshData = () => {
      employeeFilter.value = "";
      handleLoadData();
    };

    /**********************
     * Xoá 1 hàng trong bảng
     * NXTSAN 18-09-2022
     */
    function handleDeleteRow(row) {
      table.rowSelected = row;

      // Hiện message box xác nhận xoá 1 nhân viên
      setMessageBoxMode(messageBoxModeEnum.DELELE_ONE);
      messageBox.isShow = true;
    }

    /**********************
     * Xử lý nhân bản 1 hàng trong bảng
     * NXTSAN 04-10-2022
     */
    async function handleDuplicateRow(data) {
      try {
        // Lấy mã nhân viên mới
        const response = await getEmployeeByID(data.EmployeeID);

        // Kiểm tra kết quả trả về
        if (response.Success) {
          // Nếu thành công thì lấy dữ liệu thành công
          const data = response.Data;

          // Khởi tạo form nhân bản
          employeeModal.value = data;
          employeeDetail.value.modalMode = FormEnum.MODE_DUPLICATE;
          employeeDetail.value.isShow = true;
        }
      } catch (error) {
        // Nếu thất bại thì hiển thị toast message báo lỗi
        showToastMessage(
          toastMessage.ERROR,
          toastMessage.ERROR_TEXT,
          toastMessage.TEXT_RED,
          toastMessage.SERVER_ERROR
        );
      }
    }

    /**********************
     * Xử lí nhấn nút mở modal
     * NXTSAN 18-09-2022
     */
    const handleClickAddEmployee = () => {
      // Khởi tạo các thuộc tính và mở form thêm nhân viên
      employeeModal.value = {};
      employeeDetail.value.modalMode = FormEnum.MODE_ADD;
      employeeDetail.value.isShow = true;
    };

    /**********************
     * Xử lí nhấn 1 lần vào hàng
     * NXTSAN 18-09-2022
     */
    const handleClickRow = () => {};

    /**********************
     * Xử lí nhấn 2 lần vào hàng
     * NXTSAN 18-09-2022
     */
    const handleDblClickRow = async (data) => {
      try {
        // Lấy dữ liệu khi nhấn 2 lần vào hàng
        const response = await getEmployeeByID(data.EmployeeID);

        // Kiểm tra kết quả trả về
        if (response.Success) {
          // Nếu thành công thì lấy thông tin của nhân viên
          const data = response.Data;
          employeeModal.value = data;

          // Mở form sửa nhân viên
          employeeDetail.value.modalMode = FormEnum.MODE_EDIT;
          employeeDetail.value.isShow = true;
        } else {
          // Nếu thất bại thì hiển thị toast message báo lỗi
          showToastMessage(
            toastMessage.ERROR,
            toastMessage.ERROR_TEXT,
            toastMessage.TEXT_RED,
            toastMessage.SERVER_ERROR
          );
        }
      } catch (error) {
        showToastMessage(
          toastMessage.ERROR,
          toastMessage.ERROR_TEXT,
          toastMessage.TEXT_RED,
          toastMessage.SERVER_ERROR
        );
      }
    };

    /**********************
     * Đóng form nhập liệu
     * NXTSAN 18-09-2022
     */
    const closeEmployeeModal = async () => {
      // Load lại dữ liệu
      refreshData();

      // Ẩn form nhập liệu
      employeeDetail.value.isShow = false;
    };

    /***********************
     * Phân trang
     * NXTSAN 18-09-2022
     */
    const handlePaging = (index) => {
      pageNumber.value = index;
      handleGetEmployees(
        pageSize.value,
        pageNumber.value,
        employeeFilter.value
      ).then(() => (isDataReady.value = !isDataReady.value));
    };

    /***********************
     * Thay đổi số lượng bản ghi trên 1 trang
     * NXTSAN 18-09-2022
     */
    const selectedIndex = ref(0);
    const handleChangePageSize = async (pageSizeEmit, index) => {
      // Lưu lại số lượng bản ghi trên 1 trang lại vào bộ nhớ local
      localStorage.setItem("pageSize", pageSizeEmit);
      selectedIndex.value = index;

      // Cập nhật số lượng bản ghi trên 1 trang mới
      pageSize.value = pageSizeEmit;

      // Load lại dữ liệu
      await handleLoadData();
      isDataReady.value = true;
    };

    /***********************
     * Tìm kiếm các nhân viên
     * NXTSAN 18-09-2022
     */
    let timeout = null;
    const handleSearching = (employeeFilters, event) => {
      // Độ trễ 2s
      let delay = 2000;

      // Nếu vẫn đang đợi thì không đợi nữa
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // Tiếp tục đợi mới
      timeout = setTimeout(() => {
        pageNumber.value = 1;
        handleGetEmployees(
          pageSize.value,
          pageNumber.value,
          employeeFilter.value
        );
      }, delay);
    };

    /***********************
     * Lấy các nhân viên đã chọn
     * NXTSAN 09-10-2022
     */
    const getSelectedEmployees = (selectedRows, option) => {
      // Kiểm tra khi check và uncheck hàng
      if (option === "add") {
        // Nếu check thì cập nhật lại các nhân viên đã chọn
        selectedEmployees.value = [...selectedEmployees.value, selectedRows];
      } else if (option === "remove") {
        // Nếu uncheck thì xoá nhân viên đã chọn khỏi danh sách

        // Tìm index của nhân viên muốn bỏ chọn khỏi danh sách
        var selectedIndex = -1;
        for (const index in selectedEmployees.value) {
          const row = selectedEmployees.value[index];
          if (row.EmployeeID === selectedRows.EmployeeID) {
            selectedIndex = index;
            break;
          }
        }

        // Nếu tìm được thì xoá nhân viên có index đã tìm được khỏi danh sách
        if (selectedIndex > -1) {
          selectedEmployees.value.splice(selectedIndex, 1);
          selectedEmployees.value = [...selectedEmployees.value];
        }
      }
    };

    /***********************
     * Thực hiện xoá hàng loạt các bản ghi
     * NXTSAN 09-10-2022
     */
    const batchDelete = () => {
      // Mở message box xác nhận xoá nhiều
      setMessageBoxMode(messageBoxModeEnum.DELELE_MANY);
      messageBox.isShow = true;
    };

    /***********************
     * Lấy danh sách Id của các nhân viên cần xoá
     * NXTSAN 09-10-2022
     */
    const getDeleteEmployeeIDs = (selectedEmployees) => {
      // Danh sách các ID các nhân viên muốn xoá
      var deleteEmployeeIDs = [];

      // Thêm các ID của nhân viên từ danh sách nhân viên đã chọn
      for (const employee of selectedEmployees) {
        deleteEmployeeIDs.push(employee.EmployeeID);
      }
      return deleteEmployeeIDs;
    };

    return {
      isDataReady,
      employeeFilter,
      pageSize,
      pageSizes,
      pageNumber,
      showToastMessage,
      toast,
      toastMessage,
      selectedEmployees,
      getSelectedEmployees,
      batchDelete,
      isShowDatagrid,
      exportData,
      table,
      selectedIndex,
      handleLoadData,
      handleClickRow,
      handleSearching,
      handleChangePageSize,
      handleGetEmployees,
      handlePaging,
      handleDeleteRow,
      handleClickAddEmployee,
      handleDblClickRow,
      closeEmployeeModal,
      employeeModal,
      employeeDetail,
      messageBox,
      refreshData,
    };
  },
};
</script>

<style>
@import "@/styles/pages/cash-page.css";
.toast-enter-active,
.toast-leave-active {
  transition: ease 1s;
}
.toast-enter-from, .toast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(40px);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.1s ease;
}
.modal-enter-from, .modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.message-enter-active,
.message-leave-active {
  transition: opacity 0.1s ease;
}
.message-enter-from, .message-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
