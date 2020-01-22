import React from "react";
import dva, { connect } from "./dva";
const app = dva();

app.model({
  namespace: "counter",
  state: { number: 0 },
  reducers: {
    add(state) {
      return {
        number: state.number + 1
      };
    }
  },
  effects: { 
    *asyncAdd(action, {call, put}) {
      yield call(delay, 2000)
      yield put({type: 'counter/add'})
    }
  }
});

function Counter(props: any) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
      <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>asyncAdd</button>
    </div>
  );
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

const ConnectedCounter = connect((state: any) => state.counter)(Counter);
app.router(() => <ConnectedCounter />);
app.start("#root");
