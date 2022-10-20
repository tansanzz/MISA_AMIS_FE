class BaseApiService {
  baseUrl = "https://localhost:44368/api/v1";
  resource;

  constructor(resource) {
    if (!resource) throw new Error("Chua cung cap resource");
    this.resource = resource;
  }

  getUrl(id = "") {
    return `${this.baseUrl}/${this.resource}/${id}`;
  }

  handleErrors(error) {
    console.log(error);
  }
}

class ReadonlyApiService extends BaseApiService {
  constructor(resource) {
    super(resource);
  }

  async fetch(config = {}) {
    try {
      const response = await fetch(this.getUrl(), config);
      return await response.json();
    } catch (error) {
      this.handleErrors(error);
    }
  }
  
  async get(id) {
    if (!id) throw new Error("Get: Chua cung cap id");
    try {
      const response = await fetch(this.getUrl(id));
      return await response.json();
    } catch (error) {
      this.handleErrors(error);
      return [];
    }
  }
}

class ModelApiService extends ReadonlyApiService {
  constructor(resource) {
    super(resource);
  }
  async post(data = {}) {
    try {
      const response = await fetch(this.getUrl(), {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      const id = response.json();
      return id;
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async put(id, data = {}) {
    if (!id) throw Error("PUT: Chua cung cap id");
    try {
      const response = await fetch(this.getUrl(id), {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async delete(id) {
    if (!id) throw Error("Chua cung cap id");
    try {
      const response = await fetch(this.getUrl(id), {
        method: "DELETE",
      });
      return response.json();
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

export { BaseApiService, ModelApiService, ReadonlyApiService }
export default ModelApiService;