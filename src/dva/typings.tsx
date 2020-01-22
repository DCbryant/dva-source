import {Dispatch, Reducer, AnyAction, MiddlewareAPI, StoreEnhancer} from 'redux'
import {History} from 'history'

export interface ReducersMapObject {
  [key: string]: Reducer<any>
}

export interface ReducerEnhancer {
  (reducer: Reducer<any>): void
}

export interface EffectsCommandMap {
  put: <A extends AnyAction>(action: A) => any,
  call: Function,
  select: Function,
  take: Function,
  cancel: Function,
  [key: string]: any,
}

export type EffectType = 'takeEvery' | 'takeLatest' | 'watcher' | 'throttle'
export type EffectWithType = [Effect, {type: EffectType}]
export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void

export type ReducersMapObjectWithEnhancer = [ReducersMapObject, ReducerEnhancer]

export interface EffectsMapObject {
  [key: string]: Effect | EffectWithType
} 

export interface SubscriptionsMapObject {
  [key: string]: Subscription
}

export interface SubscriptionAPI {
  history: History,
  dispatch: Dispatch<any>
}

export type Subscription  = (api: SubscriptionAPI, done: Function) => void

export interface Model {
  namespace: string,
  state?: any,
  reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer,
  effects?: EffectsMapObject,
  subscriptions?: SubscriptionsMapObject
}

export interface RouterAPI {
  history: History,
  app: DvaInstance
}

export interface Router {
  (api?: RouterAPI): JSX.Element | Object
}

export interface onActionFunc {
  (api: MiddlewareAPI<any>): void
}

export interface Hooks {
  onError?: (e: Error, dispatch: Dispatch<any>) => void,
  onAction?: onActionFunc | onActionFunc[],
  onStateChange?: () => void,
  onReducer?: ReducerEnhancer,
  onEffect?: () => void,
  onHmr?: () => void,
  extraReducers?: ReducersMapObject,
  extraEnhancers?: StoreEnhancer<any>[],
}

export interface DvaInstance extends Record<any, any> {
  model: (model: Model) => void,
  router: (router: Router) => void
  start: (selector?: HTMLElement | string) => any
}