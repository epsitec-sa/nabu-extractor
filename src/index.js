'use strict';
const os           = require ('os');
const path         = require ('path');
const mkdirp       = require ('mkdirp').sync;
const StateDb      = require ('statedb').default;
const transit      = require ('transit-immutable-js');
const createStore  = require ('redux').createStore;
const nabuReducer  = require ('redux-nabu').nabuReducer;
const addMessage   = require ('redux-nabu').addMessage;

mkdirp (path.join (os.homedir (), '.epsitec'));
const nabuDbPath   = path.join (os.homedir (), '.epsitec', 'nabu');
const NabuDb       = new StateDb (nabuDbPath);
const nabuState    = NabuDb.loadState ('nabu');
const initialState = {
  nabu: nabuState ? transit.fromJSON (nabuState) : {}
};

const store        = createStore (nabuReducer, initialState);
store.subscribe ( () => {
  const state = store.getState ();
  const nabuState = transit.toJSON (state.nabu);
  NabuDb.saveState ('nabu', nabuState);
});

module.exports = (messageId, desc) => {
  store.dispatch (addMessage (messageId, desc));
};
