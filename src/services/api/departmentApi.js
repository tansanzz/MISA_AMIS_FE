import ModelApiService from "./base";
class DepartmentsApiService extends ModelApiService {
  constructor() {
    super("Departments");
  }
}

const departmentApi = new DepartmentsApiService();

const getAllDepartments = async (config) => {
  return await departmentApi.fetch(config);
};

export { getAllDepartments };
