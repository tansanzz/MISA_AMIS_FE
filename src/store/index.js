import { createStore } from "vuex";
import storePlugins from "@/plugins/storePlugins";

const GET_EMPLOYEES = "GET_EMPLOYEES";
const GET_FILTER_EMPLOYEES = "GET_FILTER_EMPLOYEES";
const ADD_EMPLOYEE = "ADD_EMPLOYEE";
const UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE";
const DELETE_EMPLOYEE = "DELETE_EMPLOYEE";
const GET_DEPARTMENTS = "GET_DEPARTMENTS";
const GET_EMPLOYEE_BY_ID = "GET_EMPLOYEE_BY_ID";

export default createStore({
  plugins: [storePlugins],
  state: {
    employee: {},
    employees: [],
    filterEmployees: {},
    departments: [],
    isLoading: false,
    isSidebarSmall: false,
    isValidate: false,
    language: "VI",
  },
  mutations: {
    setValidate(state) {
      state.isValidate = !state.isValidate
    },
    [GET_EMPLOYEES](state, employees) {
      state.employees = employees;
    },
    [GET_FILTER_EMPLOYEES](state, filterEmployees) {
      // eslint-disable-next-line
      state.filterEmployees = filterEmployees;
    },
    [GET_EMPLOYEE_BY_ID](state, employee) {
      state.employee = employee;
    },
    [ADD_EMPLOYEE](state, employees) {
      state.employees = [...state.employees, employees];
    },
    [UPDATE_EMPLOYEE](state, employees) {
      const id = employees.EmployeeID;
      const index = state.employees.findIndex(( employee ) => {
        return employee.EmployeeID === id;
      });
      if (index >= 0) {
        state.employees.splice(index, 1, employees);
      }
    },
    [DELETE_EMPLOYEE](state, employeeID) {
      const index = state.employees.findIndex(( employee ) => {
        return employee.EmployeeID === employeeID;
      });
      if (index >= 0) {
        state.employees.splice(index, 1);
      }
    },
    [GET_DEPARTMENTS](state, departments) {
      state.departments = departments;
    },
    changeLoadStatus(state) {
      state.isLoading = !state.isLoading;
    },
  },
  actions: {
    async fetchEmployees({ commit }, config) {
      commit("changeLoadStatus");
      const employees = await this.$api.employees.fetch(config);
      commit(GET_EMPLOYEES, employees);
      //   console.log({ message: "Employees from vuex", employees });
      commit("changeLoadStatus");
    },
    async fetchEmployeeByID({ commit }, employeeID) {
      commit("changeLoadStatus");
      const employee = await this.$api.employees.get(employeeID);
      commit(GET_EMPLOYEE_BY_ID, employee);
      //   console.log({ message: "Employees from vuex", employees });
      commit("changeLoadStatus");
    },
    async fetchFilterEmployees({ commit }, filter) {
      commit("changeLoadStatus");
      const filterEmployees = await this.$api.employees.get(filter);
      commit(GET_FILTER_EMPLOYEES, filterEmployees);
      // console.log({ message: "Employees filter from vuex", filterEmployees });
      commit("changeLoadStatus");
    },
    async fetchDepartments({ commit }, config) {
      commit("changeLoadStatus");
      const departments = await this.$api.departments.fetch(config);
      commit(GET_DEPARTMENTS, departments);
      // console.log({ message: "departments from vuex", departments });
      commit("changeLoadStatus");
    },
    async createEmployee({ commit }, employee) {
      commit("changeLoadStatus");
      const response = await this.$api.employees.post(employee);
      const { id } = response;
      commit(ADD_EMPLOYEE, { ...employee, id });
      commit("changeLoadStatus");
      // console.log({ message: "Created employee", post: { ...employee, id } });
      return response;
    },

    async updateEmployee({ commit }, employee) {
      commit("changeLoadStatus");
      const response = await this.$api.employees.put(employee.EmployeeID, employee);
      commit(UPDATE_EMPLOYEE, employee);
      commit("changeLoadStatus");
      return response;
      // console.log({ message: "Updated employee", put: { employee, id } });
    },

    async deleteEmployee({ commit }, employeeID) {
      commit("changeLoadStatus");
      await this.$api.employees.delete(employeeID);
      commit(DELETE_EMPLOYEE, employeeID);
      commit("changeLoadStatus");
      // console.log({ message: "Deleted employee", delete: { employeeId, result } });
    },
  },
});
