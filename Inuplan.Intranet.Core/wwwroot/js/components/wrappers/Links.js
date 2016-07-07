import { Link, IndexLink } from 'react-router'
import React from 'react'

export class NavLink extends React.Component {
    constructor(props, context) {
        super(props);
    }

    render() {
        let isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            <li className={className}>
                <Link {...this.props}>
                    {this.props.children}
                </Link>
            </li>
        )
    }
}

NavLink.contextTypes = {
    router: React.PropTypes.object
}

export class IndexNavLink extends React.Component {
    constructor(props, context) {
        super(props);
    }

    render() {
        let isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            <li className={className}>
                <IndexLink {...this.props}>
                    {this.props.children}
                </IndexLink>
            </li>
        )
    }
}

IndexNavLink.contextTypes = {
    router: React.PropTypes.object
}