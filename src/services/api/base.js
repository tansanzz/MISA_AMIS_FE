/* eslint-disable */
import store from "@/store";
class BaseApiService {
  baseUrl = "https://localhost:44368/api/v1";
  resource;
  constructor(resource) {
    if (!resource) throw new Error("Chua cung cap resource");
    this.resource = resource;
  }

  /*****************
   * Lấy đường dẫn
   * NXTSAN 10-10-2022
   */
  getUrl(id = "") {
    return `${this.baseUrl}/${this.resource}/${id}`;
  }

  /****************************************
   * Xử lý khi gặp lỗi
   * NXTSAN 10-10-2022
   */
  handleErrors() {
    console.log("Bat dau emit");
    store.commit("setError", "da co loi xay ra");
  }
}

class ReadonlyApiService extends BaseApiService {
  constructor(resource) {
    super(resource);
  }

  /********************
   * Fetch dữ liệu
   * NXTSAN 10-10-2022
   */
  async get(id) {
    const response = await fetch(this.getUrl(id));
    return await response.json();
  }
}

class ModelApiService extends ReadonlyApiService {
  constructor(resource) {
    super(resource);
  }

  /********************
   * Post dữ liệu
   * NXTSAN 10-10-2022
   */
  async post(data = {}) {
    const response = await fetch(this.getUrl(), {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  /********************
   * Put dữ liệu
   * NXTSAN 10-10-2022
   */
  async put(id, data = {}) {
    if (!id) throw Error("PUT: Chua cung cap id");
    const response = await fetch(this.getUrl(id), {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  /********************
   * Delete dữ liệu
   * NXTSAN 10-10-2022
   */
  async delete(id) {
    if (!id) throw Error("Chua cung cap id");

    const response = await fetch(this.getUrl(id), {
      method: "DELETE",
    });

    return response.json();
  }
}

export { BaseApiService, ModelApiService, ReadonlyApiService };
export default ModelApiService;
