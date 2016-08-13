'use strict';

const os          = require ('os');
const path        = require ('path');
const mkdirp      = require ('mkdirp').sync;
const StateDb     = require ('statedb');
const transit     = require ('transit-immutable-js');
const createStore = require ('redux').createStore;
const nabuReducer = require ('redux-nabu').nabuReducer;
const initState   = require ('redux-nabu').initialState;
const addMessage  = require ('redux-nabu').addMessage;

mkdirp (path.join (os.homedir (), '.epsitec'));

const nabuDbPath   = path.join (os.homedir (), '.epsitec', 'nabu');
const NabuDb       = new StateDb (nabuDbPath);
const nabuState    = NabuDb.loadState ('nabu');
const initialState = nabuState ? transit.fromJSON (nabuState) : initState;
const store        = createStore (nabuReducer, initialState);

store.subscribe ( () => {
  const state = store.getState ();
  const nabuState = transit.toJSON (state);
  NabuDb.saveState ('nabu', nabuState);
});

module.exports = (messageId, desc) => {
  store.dispatch (addMessage (messageId, desc));
};
