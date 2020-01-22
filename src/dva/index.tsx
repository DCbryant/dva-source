import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { connect, Provider } from "react-redux";
import { DvaInstance, Router, Model } from "./typings";
import prefixNamespace from "./prefixNamespace";
export { connect };

export default function() {
  const app: DvaInstance = {
    _models: [],
    model,
    router,
    _router: null,
    start
  };
  const initialReducers = {};
  function model(model: Model) {
    const prefixedModel = prefixNamespace(model);
    app._models.push(prefixedModel);
    return prefixedModel;
  }
  function router(router: Router) {
    app._router = router;
  }

  function start(root) {
    for (const model of app._models) {
      initialReducers[model.namespace] = getReducer(model);
    }
    let rootReducer = createReducer();
    let store = createStore(rootReducer);
    ReactDOM.render(
      <Provider store={store}>{app._router()}</Provider>,
      document.querySelector(root)
    );
    function createReducer() {
      return combineReducers(initialReducers);
    }
  }

  return app;
}

function getReducer(model) {
  let { reducers, state: defaultState } = model;
  let reducer = (state = defaultState, action) => {
    let reducer = reducers[action.type];
    if (reducer) {
      return reducer(state, action);
    }
    return state;
  };
  // console.log(reducer, 'reducer')
  return reducer;
}
export * from "./typings";
