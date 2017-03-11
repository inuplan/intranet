import * as React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import { Provider } from "react-redux";

import store from "./store/admin";
import { DashboardAdmin } from "./components/shells/DashboardAdmin";
import { fetchCurrentUser } from "./actions/users";

interface AdminState {
    isAdmin: boolean;
}

class Admin extends React.Component<any, AdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAdmin: false
        };
    }

    componentDidMount() {
        const future = store.dispatch(fetchCurrentUser(globals.currentUsername));
        future.then(() => {
            const storeState = store.getState();
            const user = storeState.usersInfo.users[storeState.usersInfo.currentUserId];
            const isAdmin = user ? user.IsAdmin : false;
            this.setState({ isAdmin });
        });
    }

    render() {
        const { isAdmin } = this.state;

        if (!isAdmin) return  <div>Access denied!</div>;
        return  <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route path="/admin" component={DashboardAdmin} />
                    </Router>
                </Provider>;
    }
}

render(<Admin />, document.getElementById("content"));