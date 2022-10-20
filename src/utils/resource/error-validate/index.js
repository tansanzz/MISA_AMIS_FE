/**************************
 * Lỗi mã nhân viên rỗng
 */
const EmployeeCodeNotEmpty = {
  VI: "Mã nhân viên không được để trống.",
  EN: "Employee Code is not empty.",
};
const EmployeeCode_required = {
  VI: "Mã nhân viên không được để trống.",
  EN: "Employee Code is not empty.",
};
const EmployeeCode_maxLength = {
  VI: "Mã không vượt quá ${variable} ký tự.",
  EN: "Employee Code can't exceed ${variable} characters.",
};
/**************************
 * Lỗi tên nhân viên rỗng
 */
const FullNameNotEmpty = {
  VI: "Tên không được để trống.",
  EN: "Full name is not empty.",
};
const FullName_required = {
  VI: "Tên nhân viên không được để trống.",
  EN: "Employee Code is not empty.",
};
const FullName_maxLength = {
  VI: "Tên không vượt quá ${variable} ký tự.",
  EN: "Employee Code can't exceed ${variable} characters.",
};
/**************************
 * Lỗi email rỗng
 */
const EmailNotEmpty = {
  VI: "Email không được để trống.",
  EN: "Emai is not empty.",
};
const Email_Invalid = {
  VI: "Email không hợp lệ.",
  EN: "Emai is not empty.",
}
/**************************
 * Lỗi đơn vị rỗng
 */
const DepartmentNotEmpty = {
  VI: "Đơn vị không được để trống.",
  EN: "Department is not empty.",
};
const DepartmentName_required = {
  VI: "Đơn vị không được để trống.",
  EN: "Department name is not empty.",
};
const DepartmentName_maxLength = {
  VI: "Đơn vị không vượt quá 20 ký tự.",
  EN: "Department name can't exceed 20 characters.",
};
/**************************
 * Lỗi số điện thoại rỗng
 */
const PhoneNumberNotEmpty = {
  VI: "Số điện thoại không được để trống.",
  EN: "Phone number is not empty.",
};
/***************************
 * Loi them hoac sua nhan vien da ton tai
 */
const DuplicateEmployeeCode = {
  VI: "Nhân viên này đã tồn tại.",
  EN: "Employee has existed.",
};
/***************************
 * Loi them hoac sua nhan vien da ton tai
 */
const DepartmentError = {
  VI: "Dữ liệu <Đơn vị> không có trong danh mục.",
  EN: "Employee has existed.",
};

const Email_email = {
  VI: "Email không hợp lệ.",
  EN: "Email invalid.",
};

const getMessageWithVariable = (string, variable) => {
  return string.replace(/\${variable}/g, variable);
};
export {
  Email_Invalid,
  DepartmentError,
  DepartmentName_maxLength,
  DepartmentName_required,
  DepartmentNotEmpty,
  DuplicateEmployeeCode,
  EmailNotEmpty,
  EmployeeCodeNotEmpty,
  EmployeeCode_maxLength,
  EmployeeCode_required,
  FullNameNotEmpty,
  FullName_maxLength,
  FullName_required,
  PhoneNumberNotEmpty,
  Email_email,
  getMessageWithVariable,
};

export default {
  DepartmentError,
  DepartmentName_maxLength,
  DepartmentName_required,
  DepartmentNotEmpty,
  DuplicateEmployeeCode,
  EmailNotEmpty,
  EmployeeCodeNotEmpty,
  EmployeeCode_maxLength,
  EmployeeCode_required,
  FullNameNotEmpty,
  FullName_maxLength,
  FullName_required,
  PhoneNumberNotEmpty,
  Email_email,
};
