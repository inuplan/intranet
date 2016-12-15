import { Link, IndexLink } from 'react-router';
import * as React from 'react';
export class NavLink extends React.Component {
    render() {
        let isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (<li className={className}>
                <Link to={this.props.to}>
                    {this.props.children}
                </Link>
            </li>);
    }
}
NavLink.contextTypes = {
    router: React.PropTypes.object
};
export class IndexNavLink extends React.Component {
    render() {
        let isActive = this.context.router.isActive(this.props.to, true), className = isActive ? "active" : "";
        return (<li className={className}>
                <IndexLink to={this.props.to}>
                    {this.props.children}
                </IndexLink>
            </li>);
    }
}
IndexNavLink.contextTypes = {
    router: React.PropTypes.object
};
