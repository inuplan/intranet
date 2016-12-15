import { Link, IndexLink } from 'react-router'
import * as React from 'react'

interface LinkProps {
    to: string
}

export class NavLink extends React.Component<LinkProps, any> {
    static contextTypes = {
        router: React.PropTypes.object
    }

    render() {
        let isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            <li className={className}>
                <Link to={this.props.to}>
                    {this.props.children}
                </Link>
            </li>
        )
    }
}

export class IndexNavLink extends React.Component<LinkProps, any> {
    static contextTypes = {
        router: React.PropTypes.object
    }

    render() {
        let isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "active" : "";

        return (
            <li className={className}>
                <IndexLink to={this.props.to}>
                    {this.props.children}
                </IndexLink>
            </li>
        )
    }
}