/**************************
 * Lỗi liên quan đến validate
 * Author: NXTSAN (14/09/2022)
 */
const ErrorValidate = {
  /**************************
   * Lỗi mã nhân viên rỗng
   * Author: NXTSAN (14/09/2022)
   */
  EmployeeCodeNotEmpty: {
    VI: "Mã nhân viên không được để trống.",
    EN: "Employee Code is not empty.",
  },
  /**************************
   * Lỗi mã nhân viên rỗng
   * Author: NXTSAN (14/09/2022)
   */
  EmployeeCode_required: {
    VI: "Mã nhân viên không được để trống.",
    EN: "Employee Code is not empty.",
  },
  /**************************
   * Lỗi mã nhân viên vượt quá ký tự cho phép
   * Author: NXTSAN (14/09/2022)
   */
  EmployeeCode_maxLength: {
    VI: "Mã nhân viên không vượt quá 20 ký tự.",
    EN: "Employee Code can't exceed 20 characters.",
  },
  /**************************
   * Lỗi tên nhân viên rỗng
   * Author: NXTSAN (14/09/2022)
   */
  FullNameNotEmpty: {
    VI: "Tên không được để trống.",
    EN: "Full name is not empty.",
  },
  /**************************
   * Lỗi tên nhân viên rỗng
   * Author: NXTSAN (14/09/2022)
   */
  FullName_required: {
    VI: "Tên nhân viên không được để trống.",
    EN: "Employee Code is not empty.",
  },
  /**************************
   * Lỗi tên nhân viên vượt quá số ký tự cho phép
   * Author: NXTSAN (14/09/2022)
   */
  FullName_maxLength: {
    VI: "Tên nhân viên không vượt quá 20 ký tự.",
    EN: "Employee Code can't exceed 20 characters.",
  },
  /**************************
   * Lỗi email rỗng
   * Author: NXTSAN (14/09/2022)
   */
  EmailNotEmpty: {
    VI: "Email không được để trống.",
    EN: "Emai is not empty.",
  },
  /**************************
   * Lỗi đơn vị rỗng
   * Author: NXTSAN (14/09/2022)
   */
  DepartmentNotEmpty: {
    VI: "Đơn vị không được để trống.",
    EN: "Department is not empty.",
  },
  /**************************
   * Lỗi đơn vị rỗng
   * Author: NXTSAN (14/09/2022)
   */
  DepartmentName_required: {
    VI: "Đơn vị không để trống.",
    EN: "Department name is not empty.",
  },
  /**************************
   * Lỗi đơn vị vượt quá số ký tự cho phép
   * Author: NXTSAN (14/09/2022)
   */
  DepartmentName_maxLength: {
    VI: "Đơn vị không vượt quá 20 ký tự.",
    EN: "Department name can't exceed 20 characters.",
  },
  /**************************
   * Lỗi số điện thoại rỗng
   * Author: NXTSAN (14/09/2022)
   */
  PhoneNumberNotEmpty: {
    VI: "Số điện thoại không được để trống.",
    EN: "Phone number is not empty.",
  },
  /**************************
   * Lỗi mã nhân viên đã tồn tại
   * Author: NXTSAN (14/09/2022)
   */
  DuplicateEmployeeCode: {
    VI: "Mã nhân viên <${variable}> đã tồn tại trong hệ thống, vui lòng kiểm tra lại.",
    EN: "Employee has existed.",
  },
  /**************************
   * Lỗi đơn vị không hợp lệ
   * Author: NXTSAN (14/09/2022)
   */
  DepartmentError: {
    VI: "Dữ liệu <Đơn vị> không có trong danh mục.",
    EN: "Employee has existed.",
  },
  /**************************
   * Xác nhận xoá 1 nhân viên
   * Author: NXTSAN (14/09/2022)
   */
  ConfirmDeleteEmployee: {
    VI: "Bạn có thực sự muốn xóa Nhân viên <${variable}> không?",
    EN: "Employee has existed.",
  },
  /**************************
   * Xác nhận xoá nhiều nhân viên
   * Author: NXTSAN (14/09/2022)
   */
  ConfirmDeleteEmployees: {
    VI: `Bạn có thực sự muốn xóa những nhân viên đã chọn không?`,
    EN: "Employee has existed.",
  },
};

/**************************
 * Lỗi liên quan đến modal
 * Author: NXTSAN (14/09/2022)
 */
const ModalMessage = {
  /**************************
   * Thông báo dữ liệu có sự thay đổi
   * Author: NXTSAN (14/09/2022)
   */
  DataChange: {
    title: {
      VI: "Dữ liệu đã thay đổi",
      EN: "The data has been changed, do you want to save it?",
    },
    message: {
      VI: "Dữ liệu đã bị thay đổi. Bạn có muốn cất không?",
      EN: "The data has been changed, do you want to save it?",
    },
    invalid_data: {
      VI: "Dữ liệu không hợp lệ",
      EN: "The data has been changed, do you want to save it?",
    },
    delete: {
      VI: "Xoá nhân viên",
      EN: "Delete employee",
    },
  },
};

export const ToastMessage = {
  SUCCESS: "success",
  ERROR: "error",
  SUCCESS_TEXT: "Thành công! ",
  ERROR_TEXT: "Lỗi! ",
  ICON_SUCCESS: "icon-success",
  ICON_ERROR: "icon-error",
  SUCCESS_DELETE: "Công việc đã bị xoá.",
  ERROR_UPDATE_DATA: "Không thể cập nhật được dữ liệu.",
  SERVER_ERROR: "Có vấn đề phía máy chủ.",
  ERROR_GET_DEPARTMENTS: "Chưa lấy được các đơn vị.",
  TEXT_RED: "text-red",
  TEXT_GREEN: "text-green",
  ERROR_GET_NEW_EMPLOYEECODE: "Chưa lấy được mã nhân viên mới.",
  ERROR_SERVER: "Lỗi từ phía server.",
  ERROR_UPDATE_EMPLOYEE: "Không thể sửa nhân viên.",
  ERROR_ADD_EMPLOYEE: "Không thể thêm nhân viên.",
  SUCCESS_UPDATE_EMPLOYEE: "Nhân viên đã được sửa.",
  SUCCESS_ADD_EMPLOYEE: "Nhân viên đã được thêm.",
  SUCCESS_DELETE_EMPLOYEE: "Nhân viên đã được xoá",
  ERROR_DELETE_EMPLOYEE: `Các nhân viên chưa bị xoá.`,
  ERROR_DELETE_A_EMPLOYEE: "Nhân viên ${variable} chưa bị xoá.",
  SUCCESS_DELETE_A_EMPLOYEE: "Nhân viên ${variable} đã bị xoá.",
};

export const MessageBox = {
  close: {
    TEXT: "Huỷ",
    TABINDEX: "1",
    VARIANT: "secondary",
  },
  confirmDelete: {
    TEXT: "Có",
    TABINDEX: "1",
    VARIANT: "danger",
  },
  cancel: {
    TEXT: "Không",
    TABINDEX: "1",
    VARIANT: "secondary",
  },
  confirm: {
    TEXT: "Lưu",
    TABINDEX: "1",
    VARIANT: "primary",
  },
  confirmValidate: {
    TEXT: "Đồng ý",
    TABINDEX: "1",
    VARIANT: "primary",
  },
  accept: {
    TEXT: "Đồng ý",
    TABINDEX: "1",
    VARIANT: "primary",
  },
};

const getMessageWithVariable = (string, variable) => {
  return string.replace(/\${variable}/g, variable);
};

export { ErrorValidate, ModalMessage, getMessageWithVariable };

export default {
  ErrorValidate,
};
