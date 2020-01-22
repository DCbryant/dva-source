import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware  from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import { NAMESPACE_SEP } from './constants';
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
    const sagas = getSagas(app)
    const sagaMiddleware = createSagaMiddleware()

    let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    sagas.forEach(saga => {
      sagaMiddleware.run(saga)
    })
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

function getSagas(app) {
  const sagas: Array<any> = []
  for (const model of app._models) {
    sagas.push(getSaga(model.effects, model))
  }
  return sagas
}

function getSaga(effects, model) {
  return function* () {
    for (const key in effects) {
      if (effects.hasOwnProperty(key)) {
        const watcher = getWatcher(key, model.effects[key], model)
        yield sagaEffects.fork(watcher)
      }
    }
  }
}

function getWatcher(key, effect, model) {
  return function * () {
    yield sagaEffects.takeEvery(key, function * sagaWithCatch(...args) {
      yield effect(...args, {
        ...sagaEffects,
        put: action => sagaEffects.put({
          ...action,
          type: prefixType(action.type, model)
        })
      })
    })
  }
}

function prefixType (type, model) {
  if (type.indexOf('/') === -1) {
    return `${model.namespace}${NAMESPACE_SEP}${type}`
  }
  return type
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
