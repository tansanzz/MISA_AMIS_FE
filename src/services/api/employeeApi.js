import ModelApiService from "./base";
class EmployeesApiService extends ModelApiService {
  constructor() {
    super("Employees");
  }
}

const employeeApi = new EmployeesApiService();

const getAllEmployees = async (config) => {
  return await employeeApi.fetch(config);
};

const filterEmployees = async (pageSize, pageNumber, employeeFilter) => {
  const filterQuery = `filter?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${employeeFilter}`;
  return await employeeApi.get(filterQuery);
};

const getEmployeeByID = async (employeeID) => {
  return await employeeApi.get(employeeID);
};

const getNewEmployeeCode = async () => {
  return await employeeApi.get("employee-code");
};

const updateEmployee = async (employeeID, employee) => {
  return await employeeApi.put(employeeID, employee);
};

const insertEmployee = async (employee) => {
  return await employeeApi.post(employee);
};

const deleteEmployee = async (employeeID) => {
  return await employeeApi.delete(employeeID);
};

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

const exportData = async (keyword) => {
  try {
    if (!keyword) keyword = "";
    window.location.href = employeeApi.getUrl(`export-data?keyword=${keyword}`);
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
