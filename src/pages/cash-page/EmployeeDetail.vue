<template>
  <div class="form-wrapper">
    <m-form>
      <m-form-header>
        <div class="heading-left">
          <div class="heading__title heading-2">
            {{
              modalMode == FormEnum.MODE_ADD
                ? "Thêm khách hàng"
                : modalMode == FormEnum.MODE_EDIT
                ? "Sửa khách hàng"
                : "Thông tin nhân viên"
            }}
          </div>
          <span>
            <input readonly type="checkbox" />
            <div>Là khách hàng</div>
          </span>
          <span>
            <input readonly type="checkbox" />
            <div>Là nhà cung cấp</div>
          </span>
        </div>
        <div class="heading-right">
          <m-tooltip text="Giúp (F1)">
            <div class="icon icon-24 icon-help"></div>
          </m-tooltip>
          <m-tooltip text="Đóng (ESC)">
            <div class="icon icon-24 icon-close" @click="closeModal"></div>
          </m-tooltip>
        </div>
      </m-form-header>
      <m-form-body>
        <div class="row">
          <div class="col col-50 p-r-26">
            <div class="row p-b-12">
              <m-text-field class="p-r-8">
                <m-label required> <label class="body-1">Mã</label> </m-label>
                <m-input
                  ref="refEmployeeCode"
                  :tabindex="1"
                  v-model="employee.EmployeeCode"
                  :error="errorMessages.EmployeeCode"
                  @input="validateEmployee('EmployeeCode')"
                />
              </m-text-field>
              <m-text-field>
                <m-label required><label class="body-1">Tên</label></m-label>
                <m-input
                  :ref="(el) => (refErrorField.FullName = el)"
                  :tabindex="2"
                  v-model="employee.FullName"
                  :error="errorMessages.FullName"
                  @input="validateEmployee('FullName')"
                />
              </m-text-field>
            </div>
            <div class="row p-b-12">
              <m-text-field>
                <m-label required><label class="body-1">Đơn vị</label></m-label>
                <MComboboxV2
                  :ref="(el) => (refErrorField.DepartmentName = el)"
                  :tabindex="3"
                  :data="departments"
                  v-model:id="employee.DepartmentID"
                  v-model:value="employee.DepartmentName"
                  :error="errorMessages.DepartmentName"
                  @input="validateEmployee('DepartmentName')"
                />
              </m-text-field>
            </div>
            <div class="row p-b-12">
              <m-text-field>
                <m-label><label class="body-1">Chức danh</label></m-label>
                <m-input
                  label="Chức danh"
                  :tabindex="4"
                  v-model="employee.PositionName"
                />
              </m-text-field>
            </div>
          </div>
          <div class="col col-50">
            <div class="row p-b-12">
              <m-text-field class="p-r-8">
                <m-label><label class="body-1">Ngày sinh</label></m-label>
                <MDatePicker
                  :tabindex="5"
                  v-model="employee.DateOfBirth"
                  :maxDate="new Date()"
                />
              </m-text-field>
              <m-text-field>
                <m-label><label class="body-1">Giới tính</label></m-label>
                <div class="radio-list">
                  <MRadio
                    v-for="gender in GenderEnum"
                    :key="gender.number"
                    :label="gender.label"
                    :checked="gender.number == employee.Gender"
                    :value="gender.number"
                    :tabindex="6"
                    @click-radio="handleClickRadio"
                    name="gender"
                  />
                </div>
              </m-text-field>
            </div>
            <div class="row p-b-12">
              <m-text-field class="p-r-8">
                <m-tooltip text="Số chứng minh nhân dân">
                  <m-label><label class="body-1">Số CMND</label></m-label>
                </m-tooltip>
                <m-input :tabindex="7" v-model="employee.IdentityNumber" />
              </m-text-field>
              <m-text-field>
                <m-label><label class="body-1">Ngày cấp</label></m-label>
                <MDatePicker
                  :tabindex="8"
                  v-model="employee.IdentityDate"
                  :maxDate="new Date()"
                  :minDate="new Date(employee.DateOfBirth)"
                />
              </m-text-field>
            </div>
            <m-text-field class="p-b-12">
              <m-label><label class="body-1">Nơi cấp</label></m-label>
              <m-input
                class="text-field row"
                :tabindex="9"
                v-model="employee.IdentityPlace"
              />
            </m-text-field>
          </div>
        </div>
        <div class="col">
          <m-text-field class="p-b-12">
            <m-label><label class="body-1">Địa chỉ</label></m-label>
            <m-input :tabindex="10" v-model="employee.Address" />
          </m-text-field>
          <div class="row p-b-12">
            <m-text-field class="p-r-8">
              <m-tooltip text="Điện thoại di động">
                <m-label><label class="body-1">ĐT di động</label></m-label>
              </m-tooltip>
              <m-input :tabindex="11" v-model="employee.PhoneNumber" />
            </m-text-field>
            <m-text-field class="p-r-8">
              <m-tooltip text="Điện thoại cố định">
                <m-label><label class="body-1">ĐT cố định</label></m-label>
              </m-tooltip>
              <m-input :tabindex="12" v-model="employee.FixedPhoneNumber" />
            </m-text-field>
            <m-text-field>
              <m-label><label class="body-1">Email</label></m-label>
              <m-input
                :tabindex="13"
                v-model="employee.Email"
                :error="errorMessages.Email"
                @input="validateEmployee('Email')"
              />
            </m-text-field>
          </div>
          <div class="row">
            <m-text-field class="p-r-8">
              <m-label>
                <label class="body-1">Tài khoản ngân hàng</label>
              </m-label>
              <m-input :tabindex="14" v-model="employee.BankAccount" />
            </m-text-field>
            <m-text-field class="p-r-8">
              <m-label><label class="body-1">Tên ngân hàng</label></m-label>
              <m-input
                inputValue=""
                :tabindex="15"
                v-model="employee.BankName"
              />
            </m-text-field>
            <m-text-field>
              <m-label><label class="body-1">Chi nhánh</label></m-label>
              <m-input
                inputValue=""
                :tabindex="16"
                v-model="employee.BankPlace"
              />
            </m-text-field>
          </div>
        </div>
      </m-form-body>
      <m-form-footer>
        <MButton
          variant="secondary"
          text="Huỷ"
          tabindex="19"
          @click="this.$emit('closeModal')"
        />
        <div class="action-button__right">
          <m-tooltip text="Ctrl + S">
            <MButton
              variant="secondary"
              text="Cất"
              tabindex="17"
              @click="saveDataAndClose"
            />
          </m-tooltip>
          <m-tooltip text="Ctrl + Shift + S">
            <MButton
              variant="primary"
              text="Cất và thêm"
              tabindex="18"
              @click="saveData"
            />
          </m-tooltip>
          <div
            style="position: absolute"
            tabindex="21"
            @focus="handleFocusFirst"
          ></div>
        </div>
      </m-form-footer>
    </m-form>
    <transition name="message">
      <MMessageBox
        v-if="messageBox.isShow"
        :title="messageBox.title"
        :messages="errorMessages"
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
  </div>
</template>
<script>
/* eslint-disable */
import MTextField, {
  MInput,
  MLabel,
  MRadio,
  MDatePicker,
  MComboboxV2,
} from "@/components/base/input/MTextField.vue";
import MToastMessage from "@/components/base/MToastMessage.vue";
import MForm, {
  MFormHeader,
  MFormBody,
  MFormFooter,
} from "@/components/base/form/MForm.vue";
import MButton from "@/components/base/button/MButton.vue";
import MTooltip from "@/components/base/tooltip/MTooltips.vue";
import MMessageBox from "@/components/base/MMessageBox.vue";
import {
  ErrorValidate,
  ModalMessage,
  MessageBox,
  ToastMessage,
} from "../../utils/resource.js";
import {
  EmployeeCode_required,
  FullName_required,
  DepartmentName_required,
  EmployeeCode_maxLength,
  FullName_maxLength,
  Email_Invalid,
  getMessageWithVariable,
} from "@/utils/resource/error-validate";
import FormEnum from "@/utils/enum/form";
import GenderEnum from "@/utils/enum/gender";
import KeyCodeEnum from "@/utils/enum/keycode";
import ValidateCode from "@/utils/enum/error-code";
import { toNonAccentVietnamese } from "@/utils/helper";
import {
  ref,
  onBeforeMount,
  toRefs,
  onUnmounted,
  reactive,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { required, maxLength, email } from "@/utils/validate/validators";
import {
  getNewEmployeeCode,
  updateEmployee,
  insertEmployee,
} from "@/services/api/employeeApi";
import { getAllDepartments } from "@/services/api/departmentApi";
import { validate as validateData } from "@/utils/validate/core";
import { isObject } from "@/utils/validate/validators";
const messageBoxModeEnum = {
  DATA_CHANGE: "data_change",
  SAVE_DATA: "save_data",
};
export default {
  props: {
    modalMode: {
      type: Number,
      default: 1,
    },
    employeeModal: {
      type: Object,
    },
  },
  components: {
    MTextField,
    MButton,
    MComboboxV2,
    MMessageBox,
    MDatePicker,
    MRadio,
    MForm,
    MFormHeader,
    MFormBody,
    MFormFooter,
    MInput,
    MLabel,
    MTooltip,
  },
  setup(props, context) {
    const refEmployeeCode = ref(null);
    const refErrorField = ref({
      FullName: null,
      DepartmentName: null,
    });
    const { state, commit } = useStore();
    const { employeeModal, modalMode } = toRefs(props);
    const messageBoxMode = ref(null);
    const employee = ref({});
    const messageBox = reactive({
      isShow: false,
      title: "",
      buttons: {},
      messages: {},
    });
    const departments = ref([]);
    const validate = reactive({
      EmployeeCode: {
        name: "EmployeeCode",
        rules: {
          required: required(EmployeeCode_required[state.language]),
          maxLength: maxLength(
            20,
            getMessageWithVariable(EmployeeCode_maxLength[state.language], 20)
          ),
        },
        isError: false,
      },
      FullName: {
        name: "FullName",
        rules: {
          required: required(FullName_required[state.language]),
          maxLength: maxLength(
            100,
            getMessageWithVariable(FullName_maxLength[state.language], 100)
          ),
        },
        isError: false,
      },
      DepartmentName: {
        name: "DepartmentName",
        rules: { required: required(DepartmentName_required[state.language]) },
        isError: false,
      },
      Email: {
        name: "Email",
        rules: { email: email(Email_Invalid[state.language]) },
        isError: false,
      },
    });
    const isShowToastMessage = ref(false);
    const errorMessages = ref({
      EmployeeCode: "",
      FullName: "",
      DepartmentName: "",
      Email: "",
    });
    employee.value = { ...employeeModal.value };

    onBeforeMount(async () => {
      window.addEventListener("keydown", handlePressKey);
      window.addEventListener("keyup", handlePressKey);
      const response = await getAllDepartments();
      if (response.Success) {
        const data = response.Data;
        departments.value = data;
      } else {
        context.emit(
          "showToastMessage",
          ToastMessage.ERROR,
          ToastMessage.ERROR_TEXT,
          ToastMessage.TEXT_RED,
          ToastMessage.ERROR_GET_DEPARTMENTS
        );
      }
      initModal();
    });

    onMounted(() => {
      setMessageBoxMode(messageBoxModeEnum.DATA_CHANGE);
      handleFocusFirst();
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handlePressKey);
      window.removeEventListener("keyup", handlePressKey);
    });

    /**************************************
     * Khởi tạo các giá trị ban đầu cho Modal
     * NXTSAN 10-10-2022
     */
    const initModal = async () => {
      // Gán lại các giá trị ban đầu cho nhân viên
      employee.value = { ...employeeModal.value };

      // Kiểm tra chế độ của form hiện tại
      if (
        modalMode.value == FormEnum.MODE_ADD ||
        modalMode.value == FormEnum.MODE_DUPLICATE
      ) {
        // Nếu là form thêm mới và form nhân bản thì

        // Giới tính mặc định là nam
        employee.value.Gender = 0;

        // Ngày sinh mặc định là ngày hiện tại
        employee.value.DateOfBirth = new Date().toISOString();

        // Ngày cấp chứng minh nhân dân là ngày hiện tại
        employee.value.IdentityDate = new Date().toISOString();

        // Lấy mã nhân viên mới
        handleGetNewEmployeeCode();
      }
    };

    const handleGetNewEmployeeCode = async () => {
      try {
        const response = await getNewEmployeeCode();
        if (response.Success) {
          const data = response.Data;
          if (data && data.NewEmployeeCode) {
            employee.value.EmployeeCode = data.NewEmployeeCode;
          }
        }
      } catch (error) {
        context.emit(
          "showToastMessage",
          ToastMessage.ERROR,
          ToastMessage.ERROR_TEXT,
          ToastMessage.TEXT_RED,
          ToastMessage.ERROR_GET_NEW_EMPLOYEECODE
        );
      }
    };

    /****************************************
     * Thay đổi các thuộc tính cho MessageBox
     * NXTSAN 10-10-2022
     */
    const setMessageBoxMode = (messageBoxMode) => {
      // Kiểm tra chế độ của message box muốn hiển thị
      if (messageBoxMode == messageBoxModeEnum.DATA_CHANGE) {
        // Nếu là chế độ khi có dữ liệu thay đổi thì cập nhật tiêu đề cho message box
        messageBox.title = ModalMessage.DataChange.title[state.language];

        // Xoá các lỗi khi validate dữ liệu đi
        for (const fieldName in errorMessages.value) {
          delete errorMessages.value[fieldName];
        }

        // Cập nhật lại tin nhắn trong message box
        errorMessages.value.DataChange =
          ModalMessage.DataChange.message[state.language];

        // Cập nhật lại các nút trong message box
        messageBox.buttons = {
          // Nút đóng message box
          close: {
            text: MessageBox.close.TEXT,
            tabindex: MessageBox.close.TABINDEX,
            variant: MessageBox.close.VARIANT,
            callback: () => {
              messageBox.isShow = false;
            },
          },
          // Nút đóng form
          cancel: {
            text: MessageBox.cancel.TEXT,
            tabindex: MessageBox.cancel.TABINDEX,
            variant: MessageBox.cancel.VARIANT,
            callback: () => {
              context.emit("closeModal");
            },
          },
          // Nút lưu dữ liệu và đóng form
          confirm: {
            text: MessageBox.confirm.TEXT,
            tabindex: MessageBox.confirm.TABINDEX,
            variant: MessageBox.confirm.VARIANT,
            callback: () => {
              saveDataAndClose();
            },
          },
        };
      } else {
        // Nếu chế độ của message box không phải là thay đổi dữ liệu thì xoá câu hiển thị thay đổi dữ liệu
        delete errorMessages.value.DataChange;

        // Cập nhật lại tiêu đề cho message box
        messageBox.title = ModalMessage.DataChange.invalid_data[state.language];

        // Cập nhật lại nút cho message box
        messageBox.buttons = {
          // Nút đóng message box
          close: {
            text: MessageBox.confirmValidate.TEXT,
            tabindex: MessageBox.confirmValidate.TABINDEX,
            variant: MessageBox.confirmValidate.VARIANT,
            callback: () => {
              messageBox.isShow = false;
              focusErrorField();
            },
          },
        };
      }
    };

    /***************************
     * Xử lí khi gõ phím
     * NXTSAN 18-09-2022
     */
    var key = [];
    const handlePressKey = async (event) => {
      var e = e || event;
      key[e.keyCode] = e.type == "keydown";

      // Kiểm tra danh sách tổ hợp phím đang nhập
      if (
        key[KeyCodeEnum.CTRL] &&
        key[KeyCodeEnum.SHIFT] &&
        key[KeyCodeEnum.S]
      ) {
        // Nếu tổ hợp phím là CTRL + SHIFT + S thì lưu dữ liệu
        event.preventDefault();
        saveData();
        key = [];
      } else if (key[KeyCodeEnum.CTRL] && key[KeyCodeEnum.S]) {
        // Nếu tổ hợp phím là CTRL + S thì lưu dữ liệu và đóng form nhập liệu
        event.preventDefault();
        saveDataAndClose();
        key = [];
      } else if (key[KeyCodeEnum.ESC]) {
        // Nếu tổ hợp phím là ESC thì đóng form nhập liệu
        closeModal();
        key = [];
      }
    };

    /*****************************
     * Đóng form
     * NXTSAN 18-09-2022
     */
    const closeModal = () => {
      // Kiểm tra sự thay đổi của dữ liệu
      const isChange = isDataChange(employee.value, employeeModal.value);
      if (isChange) {
        // Nếu có sự thay đổi thì hiển thị message box cảnh báo dữ liệu thay đổi
        setMessageBoxMode(messageBoxModeEnum.DATA_CHANGE);
        messageBox.isShow = true;
        return;
      }
      // Nếu không có sự thay đổi thì đóng form nhập liệu
      context.emit("closeModal");
    };

    /*******************************
     * Kiểm tra sự thay đổi của dữ liệu
     * NXTSAN 11-10-2022
     */
    const isDataChange = (oldObject, newObject) => {
      if (typeof oldObject === "object" && typeof newObject === "object") {
        for (const property in oldObject) {
          if (oldObject[property] !== newObject[property]) {
            return true;
          }
        }
      }
      return false;
    };

    /*****************************
     * Thêm dữ liệu và đóng form
     * NXTSAN 18-09-2022
     */
    const saveDataAndClose = async () => {
      // Kiểm tra dữ liệu có hợp lệ không
      const isValidData = validateEmployee();
      if (!isValidData) {
        // Nếu không hợp lệ thì hiển thị lỗi
        notifyError();
        return;
      }

      // Nếu hợp lệ thì tiến hành thực thi API
      const excuteSuccess = await excuteApi();

      // Đóng form nhập liệu
      if (excuteSuccess) context.emit("closeModal");
    };
    /*****************************
     * Thêm dữ liệu
     * NXTSAN 18-09-2022
     */
    const saveData = async () => {
      // Kiểm tra dữ liệu có hợp lệ không
      const isValidData = validateEmployee();
      if (!isValidData) {
        // Nếu không hợp lệ thì hiển thị lỗi
        notifyError();
        return;
      }

      // Nếu hợp lệ thì tiến hành thực thi API
      const excuteSuccess = await excuteApi();

      if (
        excuteSuccess &&
        (modalMode.value == FormEnum.MODE_ADD ||
          modalMode.value == FormEnum.MODE_DUPLICATE)
      )
        // Nếu chế độ form hiện tại là thêm mới nhân viên hoặc nhân bản thì khởi tạo lại form nhập liệu
        initModal();
    };

    /*****************************
     * Validate dữ liệu
     * NXTSAN 18-09-2022
     */
    const validateEmployee = (fieldName) => {
      // Lấy các trường cần validate
      var validateField = validate;
      var isValidEmployee = true;

      if (typeof fieldName === "string") {
        validateField = {};
        validateField[fieldName] = validate[fieldName];
      }

      // Validate dữ liệu
      for (const fieldName in validateField) {
        const field = validateField[fieldName];
        const rules = field.rules;
        if (isObject(rules)) {
          const validateResult = validateData(rules, employee.value[fieldName]);
          if (validateResult.length > 0) {
            errorMessages.value[fieldName] = validateResult[0];
            isValidEmployee = false;
          } else {
            errorMessages.value[fieldName] = "";
          }
        }
      }

      // Validate department
      if (errorMessages.value.DepartmentName === "") {
        errorMessages.value.DepartmentName = validateDepartment();
      }

      return isValidEmployee;
    };

    /*****************************
     * Validate trường đơn vị
     * NXTSAN 18-09-2022
     */
    const validateDepartment = () => {
      const departmentId = employee.value.DepartmentID;
      const departmentName = employee.value.DepartmentName;
      for (const index in departments.value) {
        const department = departments.value[index];
        if (department.DepartmentID === departmentId) {
          if (
            toNonAccentVietnamese(department.DepartmentName) ===
            toNonAccentVietnamese(departmentName)
          )
            return "";
          return ErrorValidate.DepartmentError[state.language];
        }
      }
      return ErrorValidate.DepartmentError[state.language];
    };

    /*****************************
     * Thực hiện thao tác với api
     * NXTSAN 18-09-2022
     */
    const excuteApi = async () => {
      // Chuyển đối tượng nhân viên sang json
      const jsonEmployee = JSON.parse(JSON.stringify(employee.value));
      var result;
      // Kiểm trạ chế độ của form nhập liệu
      switch (modalMode.value) {
        case FormEnum.MODE_EDIT:
          try {
            // Nếu là thêm thì thêm nhân viên
            result = await updateEmployee(
              jsonEmployee.EmployeeID,
              jsonEmployee
            );
            switch (result.status) {
              case 200:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 201:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 400:
                // Nếu không thành công thì lấy lỗi gửi về từ API
                getErrorAfterExcuteApi(await result.json());

                // Hiển thị các lỗi gửi về
                notifyError();
                return false;
              case 500:
                showToastMessage(ToastMessage.ERROR);
                return false;
            }
          } catch (error) {
            showToastMessage(ToastMessage.ERROR);
            return false;
          }
        case FormEnum.MODE_ADD:
          try {
            // Nếu là thêm thì thêm nhân viên
            result = await insertEmployee(jsonEmployee);
            switch (result.status) {
              case 200:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 201:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 400:
                // Nếu không thành công thì lấy lỗi gửi về từ API
                getErrorAfterExcuteApi(await result.json());

                // Hiển thị các lỗi gửi về
                notifyError();
                return;
              case 500:
                showToastMessage(ToastMessage.ERROR);
                return;
            }
          } catch (error) {
            showToastMessage(ToastMessage.ERROR);
            return;
          }
        case FormEnum.MODE_DUPLICATE:
          try {
            // Nếu là thêm thì thêm nhân viên
            result = await insertEmployee(jsonEmployee);
            switch (result.status) {
              case 200:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 201:
                // Nếu thực thi API thành công thì hiển thị toast message thông báo thành công
                showToastMessage(ToastMessage.SUCCESS);
                return true;
              case 400:
                // Nếu không thành công thì lấy lỗi gửi về từ API
                getErrorAfterExcuteApi(await result.json());

                // Hiển thị các lỗi gửi về
                notifyError();
                return;
              case 500:
                showToastMessage(ToastMessage.ERROR);
                return;
            }
          } catch (error) {
            showToastMessage(ToastMessage.ERROR);
            return;
          }
      }
    };

    /*****************************
     * Hiển thị toast message
     * NXTSAN 13-10-2022
     */
    const showToastMessage = (status) => {
      // Kiểm tra các trạng thái toast message
      switch (status) {
        case "success":
          if (
            modalMode.value == FormEnum.MODE_ADD ||
            modalMode.value == FormEnum.MODE_DUPLICATE
          )
            // Trường hợp thành công và chế độ form nhập liệu là thêm và nhân bản
            context.emit(
              "showToastMessage",
              ToastMessage.SUCCESS,
              ToastMessage.SUCCESS_TEXT,
              ToastMessage.TEXT_GREEN,
              ToastMessage.SUCCESS_ADD_EMPLOYEE
            );
          if (modalMode.value == FormEnum.MODE_EDIT)
            // Trường hợp thành công và chế độ form nhập liệu là sửa
            context.emit(
              "showToastMessage",
              ToastMessage.SUCCESS,
              ToastMessage.SUCCESS_TEXT,
              ToastMessage.TEXT_GREEN,
              ToastMessage.SUCCESS_UPDATE_EMPLOYEE
            );
          break;
        case "error":
          if (
            modalMode.value == FormEnum.MODE_ADD ||
            modalMode.value == FormEnum.MODE_DUPLICATE
          )
            // Trường hợp thất bại và chế độ form nhập liệu là thêm và nhân bản
            context.emit(
              "showToastMessage",
              ToastMessage.ERROR,
              ToastMessage.ERROR_TEXT,
              ToastMessage.TEXT_RED,
              ToastMessage.ERROR_ADD_EMPLOYEE
            );
          if (modalMode.value == FormEnum.MODE_EDIT)
            // Trường hợp thất bại và chế độ form nhập liệu là sửa
            context.emit(
              "showToastMessage",
              ToastMessage.ERROR,
              ToastMessage.ERROR_TEXT,
              ToastMessage.TEXT_RED,
              ToastMessage.ERROR_UPDATE_EMPLOYEE
            );
          break;
        case "exception":
          // Trường hợp khi có lỗi từ server
          context.emit(
            "showToastMessage",
            ToastMessage.ERROR,
            ToastMessage.ERROR_TEXT,
            ToastMessage.TEXT_RED,
            ToastMessage.ERROR_SERVER
          );
          break;
        default:
          break;
      }
    };

    /*****************************************************
     * Trả lại lỗi sau khi thực thi api
     * NXTSAN 18-09-2022
     */
    const getErrorAfterExcuteApi = (response) => {
      // Lấy các lỗi trả về từ server
      const responseError = response.Data;

      // Lấy mã lỗi trả về từ server
      const errorCode = responseError.ErrorCode;

      if (errorCode == ValidateCode.DuplicateCode) {
        // Nếu mã lỗi là nhân viên trùng lặp
        errorMessages.value.EmployeeCode = getMessageWithVariable(
          ErrorValidate.DuplicateEmployeeCode[state.language],
          employee.value.EmployeeCode
        );
      }
      if (errorCode == ValidateCode.ValidateInput) {
        // Nếu mã lỗi là lỗi validate dữ liệu
        for (const key in responseError.MoreInfo) {
          const error = responseError.MoreInfo[key];
          errorMessages.value[key] = error;
        }
      }
    };

    /*****************************
     * Hiển thị lỗi lên màn hình
     * NXTSAN 18-09-2022
     */
    const notifyError = () => {
      // Hiển thị message box ở chế độ lưu dữ liệu
      setMessageBoxMode(messageBoxModeEnum.SAVE_DATA);
      messageBox.isShow = true;
    };

    const focusErrorField = () => {
      var errorField;
      for (const key in errorMessages.value) {
        const validateField = errorMessages.value[key];
        if (validateField.length > 0 && refErrorField.value[key]) {
          errorField = key;
          break;
        }
      }
      if (refErrorField.value[errorField])
        refErrorField.value[errorField].$el.children[0].focus();
    };

    /*****************************
     * Xử lí chọn radio
     * NXTSAN 18-09-2022
     */
    const handleClickRadio = (value) => {
      employee.value.Gender = value;
    };

    /*****************************
     * Focus vào input đầu tiên
     * NXTSAN 18-09-2022
     */
    const handleFocusFirst = () => {
      refEmployeeCode.value.$el.children[0].focus();
    };

    return {
      refEmployeeCode,
      refErrorField,
      validateEmployee,
      errorMessages,
      isShowToastMessage,
      handleFocusFirst,
      refEmployeeCode,
      messageBoxMode,
      GenderEnum,
      FormEnum,
      messageBox,
      validate,
      messageBox,
      employee,
      departments,
      handleClickRadio,
      closeModal,
      saveDataAndClose,
      saveData,
    };
  },
  emits: ["closeModal", "showToastMessage"],
};
</script>

<style>
@import "@/styles/base/popup.css";
.message-enter-active,
.message-leave-active {
  transition: opacity 0.1s ease;
}
.message-enter-from, .message-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
