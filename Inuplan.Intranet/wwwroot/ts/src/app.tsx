import * as ReactDOM from 'react-dom'
import { Route, Router, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Main from './components/shells/Main'
import Home from './components/containers/Home'
import { init, fetchWhatsNew } from './utilities/onstartup'

init();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} onEnter={fetchWhatsNew} />
            </Route>
        </Router>
    </Provider>
    , document.getElementById("content"));