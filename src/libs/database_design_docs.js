// @flow

let designDoc = {
  'views': {
    clients: {
      "map": function (doc) {
        if(doc.type === 'client') {
          emit(doc._id, doc);
        }
      }.toString()
    },
    diets: {
      "map": function (doc) {
        if(doc.type === 'diet') {
          emit(doc.user, doc);
        }
      }.toString()
    },
    clientDiets: {
      "map": function (doc) {
        if(doc.type === 'clientDiet' && doc.available && !doc.completed) {
          emit(doc.user, doc);
        }
      }.toString()
    },
    foods: {
      "map": function (doc) {
        if(doc.type === 'food') {
          emit(doc._id, doc);
        }
      }.toString()
    },
  }
}

module.exports = designDoc;
