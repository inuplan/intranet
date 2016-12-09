import * as ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

ReactDOM.render(
    <Provider>
        <Router history={browserHistory}>
        </Router>
    </Provider>
    , document.getElementById("content"));