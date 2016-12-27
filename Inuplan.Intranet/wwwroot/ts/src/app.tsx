import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Main from './components/shells/Main'
import Home from './components/containers/Home'
import Forum from './components/shells/Forum'
import ForumList from './components/containers/ForumList'
import ForumPost from './components/containers/ForumPost'
import ForumComments from './components/containers/ForumComments'
import Users from './components/containers/Users'
import UserImages from './components/containers/UserImages'
import SelectedImage from './components/containers/SelectedImage'
import ImageComments from './components/containers/ImageComments'
import SingleImageComment from './components/containers/SingleImageComment'
import About from './components/containers/About'
import { init, fetchForum, selectImage, fetchImages, loadComments, fetchComment, fetchWhatsNew, fetchSinglePost, fetchPostComments } from './utilities/onstartup'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'

init();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} onEnter={fetchWhatsNew} />
                <Route path="forum" component={Forum}>
                    <IndexRoute component={ForumList} onEnter={fetchForum} />
                    <Route path="post/:id" component={ForumPost} onEnter={fetchSinglePost}>
                        <Route path="comments" component={ForumComments} onEnter={fetchPostComments} />
                    </Route>
                </Route>
                <Route path="users" component={Users} />
                <Route path=":username/gallery" component={UserImages} onEnter={fetchImages}>
                    <Route path="image/:id" component={SelectedImage} onEnter={selectImage}>
                        <Route path="comments" component={ImageComments} onEnter={loadComments} />
                        <Route path="comment" component={SingleImageComment} onEnter={fetchComment} />
                    </Route>
                </Route>
                <Route path="about" component={About} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'));
