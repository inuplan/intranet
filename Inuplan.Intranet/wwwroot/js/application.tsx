/// <reference path="../../typings/index.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

ReactDOM.render(
    <Provider>
        <Router history={browserHistory}>
        </Router>
    </Provider>
    , document.getElementById("content"));