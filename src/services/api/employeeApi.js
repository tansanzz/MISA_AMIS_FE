import ModelApiService from "./base";
class EmployeesApiService extends ModelApiService {
  constructor() {
    super("Employees");
  }
}

const employeeApi = new EmployeesApiService();

/********************
 * Lấy tất cả nhân viên
 * NXTSAN 10-10-2022
 */
const getAllEmployees = async (config) => {
  return await employeeApi.fetch(config);
};

/********************
 * Lấy tất cả nhân viên thoả mãn bộ lọc
 * NXTSAN 10-10-2022
 */
const filterEmployees = async (pageSize, pageNumber, employeeFilter) => {
  const filterQuery = `filter?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${employeeFilter}`;
  return await employeeApi.get(filterQuery);
};

/********************
 * Lấy nhân viên theo ID nhân viên
 * NXTSAN 10-10-2022
 */
const getEmployeeByID = async (employeeID) => {
  return await employeeApi.get(employeeID);
};

/********************
 * Lấy mã nhân viên mới
 * NXTSAN 10-10-2022
 */
const getNewEmployeeCode = async () => {
  return await employeeApi.get("employee-code");
};

/********************
 * Cập nhật thông tin nhân viên
 * NXTSAN 10-10-2022
 */
const updateEmployee = async (employeeID, employee) => {
  return await employeeApi.put(employeeID, employee);
};

/********************
 * Thêm nhân viên mới
 * NXTSAN 10-10-2022
 */
const insertEmployee = async (employee) => {
  return await employeeApi.post(employee);
};

/********************
 * Xoá 1 nhân viên
 * NXTSAN 10-10-2022
 */
const deleteEmployee = async (employeeID) => {
  return await employeeApi.delete(employeeID);
};

/********************
 * Xoá nhiều nhân viên
 * NXTSAN 10-10-2022
 */
const batchDeleteEmployees = async (employeeIDs) => {
  try {
    const response = await fetch(employeeApi.getUrl("batch-delete"), {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(employeeIDs),
    });
    return response.json();
  } catch (err) {
    employeeApi.handleErrors(err);
  }
};

/********************
 * Xuất khẩu dữ liệu thoã mản từ khoá tìm kiếm
 * NXTSAN 10-10-2022
 */
const exportData = async (keyword) => {
  try {
    if (!keyword) keyword = "";
    window.location.href = employeeApi.getUrl(`export-data?keyword=${keyword}`);
    console.log(employeeApi.getUrl(`export-data?keyword=${keyword}`));
  } catch (err) {
    employeeApi.handleErrors(err);
  }
};

export {
  getAllEmployees,
  filterEmployees,
  getEmployeeByID,
  getNewEmployeeCode,
  updateEmployee,
  insertEmployee,
  deleteEmployee,
  batchDeleteEmployees,
  exportData,
};
