'use strict';

var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp').sync;
var StateDb = require('statedb').default;
var transit = require('transit-immutable-js');
var createStore = require('redux').createStore;
var nabuReducer = require('redux-nabu').nabuReducer;
var addMessage = require('redux-nabu').addMessage;

mkdirp(path.join(os.homedir(), '.epsitec'));
var nabuDbPath = path.join(os.homedir(), '.epsitec', 'nabu');
var NabuDb = new StateDb(nabuDbPath);
var nabuState = NabuDb.loadState('nabu');
var initialState = {
  nabu: nabuState ? transit.fromJSON(nabuState) : {}
};

var store = createStore(nabuReducer, initialState);
store.subscribe(function () {
  var state = store.getState();
  var nabuState = transit.toJSON(state.nabu);
  NabuDb.saveState('nabu', nabuState);
});

module.exports = function (messageId, desc) {
  store.dispatch(addMessage(messageId, desc));
};