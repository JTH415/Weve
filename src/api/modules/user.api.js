import Api from '../api.base';

const resource = 'api/users';

/**
 * @name Class UserApi
 * @extends Api
 */
export default class UserApi extends Api {
  constructor() {
    super(resource);
  }

  fetchProfile = async (_id) => {
    try {
      const response = await this.getOne(_id);
      if (response.message || response.error) { // check for error
        return Promise.reject(response);
      }
      return response;
    } catch ({ message }) { throw Error(message); }
  }

  updateProfile = async (body) => {
    try {
      const response = await this.update('me', body);
      if (response.message || response.error) { // check for error
        return Promise.reject(response);
      }
      return response;
    } catch ({ message }) { throw Error(message); }
  }

  changePassword = async (body) => {
    try {
      const response = await this.update('me', body);
      if (response.message || response.error) { // check for error
        return Promise.reject(response);
      }
      return response;
    } catch ({ message }) { throw Error(message); }
  }
}