import {NAMESPACE_SEP } from './constants'

interface Obj {
  [key: string]: string,
}

function prefix(obj: Obj, namespace: string): Obj {
  return Object.keys(obj).reduce((memo, key) => {
    const newKey = `${namespace}${NAMESPACE_SEP}${key}`
    memo[newKey] = obj[key]
    return memo
  }, {})
}

export default function prefixNamespace (model) {
  if (model.reducers) {
    model.reducers = prefix(model.reducers, model.namespace)
  }

  if (model.effects) {
    model.effects = prefix(model.effects, model.namespace)
  }

  return model
}