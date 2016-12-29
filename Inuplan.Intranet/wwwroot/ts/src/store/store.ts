import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/root";
import { Root } from "../interfaces/State";

const store: Store<Root> = createStore(rootReducer, applyMiddleware(thunk));
export default store;