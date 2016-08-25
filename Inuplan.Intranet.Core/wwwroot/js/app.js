import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { store } from './stores/store'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { fetchCurrentUser, fetchUsers } from './actions/users'
import Main from './components/Main'
import About from './components/containers/About'
import Home from './components/containers/Home'
import Users from './components/containers/Users'
import UserImages from './components/containers/UserImages'
import SelectedImage from './components/containers/SelectedImage'
import { Comments } from './components/containers/Comments'
import { SingleComment } from './components/comments/SingleComment'
import { fetchUserImages, setSelectedImg, fetchSingleImage, setImageOwner } from './actions/images'
import { fetchComments, setSkipComments, setTakeComments, fetchAndFocusSingleComment } from './actions/comments'

store.dispatch(fetchCurrentUser(globals.currentUsername));
store.dispatch(fetchUsers());
moment.locale('da');

const selectImage = (nextState) => {
    const imageId = nextState.params.id;
    store.dispatch(setSelectedImg(imageId));
}

const fetchImages = (nextState) => {
    const username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));

    // reset comment state
    store.dispatch(setSkipComments(undefined));
    store.dispatch(setTakeComments(undefined));
}

const loadComments = (nextState) => {
    const { username, id } = nextState.params;
    const { page } = nextState.location.query;
    const { skip, take } = store.getState().commentsInfo;

    if(!page) {
        store.dispatch(fetchComments(id, skip, take));
    }
    else {
        const skipPages = page - 1;
        const skipItems = (skipPages * take);
        store.dispatch(fetchComments(id, skipItems, take));
    }
}

const fetchComment = (nextState) => {
    const { id } = nextState.location.query;
    store.dispatch(fetchAndFocusSingleComment(id));
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} />
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