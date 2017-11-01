// @flow

import config from './config';
import moment from "moment";
let authApi = config.authApi;
let auth0_api = config.auth0_api;

let Api = {
  setDatabase(database) {
    this.database = database;
  },

  userInfo(accessToken) {
    return fetch(`${auth0_api}/userinfo`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      return response.json();
    });
  },

  remoteUserProfile(email) {
    return this.makeRequest('GET', `/${config.database}/profile:${email}`)
      .then((res) => {
        return res.json();
      });
  },

  remoteUserProfileUpdate(profile) {
    let options = {};
    options.rev = profile._rev;

    return this.makeRequest('PUT', `/${config.database}/${profile._id}`, options, profile)
      .then((res) => {
         return res.json();
       });
  },

  userProfile(email) {
    return this.getDocument(`profile:${email}`);
  },

  createClient(client: any, ptEmail: string) {
    return this.makeRequest('POST', '/signup', {}, client)
      .then((res) => {
        if(res.status >= 200 && res.status < 300) {
          client._id = `profile:${client.email}`,
          client.type = 'client',
          client.members = [client.email, ptEmail];
          client.createdAt = this.timestamp();
          return this.database.createDocument(client);
        }
        return res.json();
      })
      .catch((error) => {
        console.log("Failed to create client", error);
      });
  },

  shortListFood(foodId, user) {
    let docId = `shortlist:foods:${user.email}`;

    return this.getDocument(docId)
      .then((res) => {
        let doc = res;

        if(res.status) {
          doc = { foodIds: [foodId], type: 'shortList' };
          doc._id = docId;
          doc.members = user.members;

          return this.createDocument(doc);
        } else {
          doc.type = 'shortList';
          doc.foodIds.push(foodId);

          return this.updateDocument(doc);
        }
      });
  },

  removeShortListFood(foodId, user) {
    let docId = `shortlist:foods:${user.email}`;

    return this.getDocument(docId)
      .then((res) => {
        let doc = res;

        doc.foodIds = doc.foodIds.filter(x => !(x === foodId));
        return this.updateDocument(doc);
      });
  },

  fetchFoodShortList(email) {
    let docId = `shortlist:foods:${email}`;

    return this.database.getDocument(docId);
  },

  fetchView(viewName, options = {}) {
    return this.database.queryView('litehq_design_doc', viewName, options);
  },

  createDocument(doc) {
    doc.createdAt = doc.createdAt || this.timestamp();
    return this.database.createDocument(doc);
  },

  updateDocument(doc) {
    doc.updatedAt = this.timestamp();
    const rev = doc._rev;
    doc._rev = undefined;
    return this.database.updateDocument(doc, doc._id, rev);
  },

  deleteDocument(doc) {
    return this.database.deleteDocument(doc._id, doc._rev);
  },

  getDocument(documentId, options) {
    return this.database.getDocument(documentId, options);
  },

  timestamp() {
    return moment().format();
  },

  deleteDatabase() {
    return this.database.deleteDatabase();
  },

  replicateLocal(options) {
    return this.database.replicate(config.local_db, options, { continuous: true });
  },

  replicateRemote(options) {
    return this.database.replicate(options, config.local_db, { continuous: true });
  },

  /**
  * Make a RESTful request to an endpoint while providing parameters or data or both
  *
  * @param string method
  * @param string url
  * @param object params
  * @param object data
  * @returns {*|promise}
  */
  makeRequest(method, url, params, data) {
    let settings = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    if (params) {
      settings.params = params;
    }
    if (data) {
      settings.body = JSON.stringify(data);
    }

    return fetch(`${authApi}${url}`, settings);
  }
};

module.exports = Api;
