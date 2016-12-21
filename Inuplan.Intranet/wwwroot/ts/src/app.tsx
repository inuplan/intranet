import * as ReactDOM from 'react-dom'
import { Route, Router, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Main from './components/shells/Main'
import Home from './components/containers/Home'
import Forum from './components/shells/Forum'
import ForumList from './components/containers/ForumList'
import ForumPost from './components/containers/ForumPost'
import { init, fetchWhatsNew, fetchForum, fetchSinglePost } from './utilities/onstartup'

init();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} onEnter={fetchWhatsNew} />
                <Route path="forum" component={Forum}>
                    <IndexRoute component={ForumList} onEnter={fetchForum} />
                    <Route path="post/:id" component={ForumPost} onEnter={fetchSinglePost} />
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.getElementById("content"));