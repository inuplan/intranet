import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store } from './stores/store'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { fetchCurrentUser } from './actions/users'
import Main from './components/Main'
import About from './components/containers/About'
import Home from './components/containers/Home'
import Users from './components/containers/Users'
import UserImages from './components/containers/UserImages'

store.dispatch(fetchCurrentUser(globals.currentUsername));
moment.locale('da');

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} />
                <Route path="users" component={Users} />
                <Route path="about" component={About} />
                <Route path=":username/gallery" component={UserImages} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'));
