import ModelApiService from "./base";
class DepartmentsApiService extends ModelApiService {
  constructor() {
    super("Departments");
  }
}

const departmentApi = new DepartmentsApiService();

/********************
 * Lấy tất cả đơn vị
 * NXTSAN 10-10-2022
 */
const getAllDepartments = async (config) => {
  return await departmentApi.get(config);
};

export { getAllDepartments };
