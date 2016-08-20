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
import SelectedImage from './components/containers/SelectedImage'
import { fetchUserImages, setSelectedImg, fetchSingleImage, setImageOwner } from './actions/images'

store.dispatch(fetchCurrentUser(globals.currentUsername));
moment.locale('da');

const enterSelectedImage = (nextState) => {
    const imageId = nextState.params.id;
    store.dispatch(setSelectedImg(imageId));
}

const enterGallery = (nextState) => {
    const username = nextState.params.username;
    store.dispatch(setImageOwner(username));
    store.dispatch(fetchUserImages(username));
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Home} />
                <Route path="users" component={Users} />
                <Route path="about" component={About} />
                <Route path=":username/gallery" component={UserImages} onEnter={enterGallery}>
                    <Route path="image/:id" component={SelectedImage} onEnter={enterSelectedImage}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'));