import apiClient from "./api-client";

class HttpService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll(entities) {
    const controller = new AbortController();
    const request = apiClient.get(`${this.endpoint}/${entities}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  getOneById(id){
    return apiClient.get(`${this.endpoint}/${id}`)
  }

  delete(id) {
    return apiClient.delete(this.endpoint + "/" + id);
  }

  create(entity) {
    return apiClient.post(this.endpoint, entity);
  }

  update(entity) {
    return apiClient.patch(this.endpoint + "/" + entity.id, entity);
  }
}

const create = (endpoint) => new HttpService(endpoint);

export default create;