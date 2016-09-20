import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/Main'
import About from './components/containers/About'
import Home from './components/containers/Home'
import Users from './components/containers/Users'
import UserImages from './components/containers/UserImages'
import SelectedImage from './components/containers/SelectedImage'
import Forum from './components/containers/Forum'
import ForumPost from './components/forum/ForumPost'
import ForumList from './components/containers/ForumList'
import { Comments } from './components/containers/Comments'
import { SingleComment } from './components/comments/SingleComment'
import { fetchCurrentUser, fetchUsers } from './actions/users'
import { fetchForum, selectImage, fetchImages, loadComments, fetchComment, fetchWhatsNew, fetchSinglePost } from './utilities/onstartup'
import { connect, Provider } from 'react-redux'
import { store } from './stores/store'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

store.dispatch(fetchCurrentUser(globals.currentUsername));
store.dispatch(fetchUsers());
moment.locale('da');

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} onEnter={fetchWhatsNew} />
                <Route path="forum" component={Forum}>
                    <Route path="threads" component={ForumList} onEnter={fetchForum}/>
                    <Route path="post/:id" component={ForumPost} onEnter={fetchSinglePost}>
                    </Route>
                </Route>
                <Route path="users" component={Users} />
                <Route path="about" component={About} />
                <Route path=":username/gallery" component={UserImages} onEnter={fetchImages}>
                    <Route path="image/:id" component={SelectedImage} onEnter={selectImage}>
                        <Route path="comments" component={Comments} onEnter={loadComments} />
                        <Route path="comment" component={SingleComment} onEnter={fetchComment} />
                    </Route>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'));
