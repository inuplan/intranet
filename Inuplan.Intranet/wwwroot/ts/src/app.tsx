import * as ReactDOM from 'react-dom'
import { Route, Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Main from './components/shells/Main'
import { init } from './utilities/onstartup'

init();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
            </Route>
        </Router>
    </Provider>
    , document.getElementById("content"));