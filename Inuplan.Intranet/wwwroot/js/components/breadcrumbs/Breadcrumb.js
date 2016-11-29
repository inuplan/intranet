import React from 'react'
import { Link } from 'react-router'

export class Breadcrumb extends React.Component {
    render() {
        return  <ol className="breadcrumb">
                    {this.props.children}
                </ol>
    }
}

Breadcrumb.Item = class Item extends React.Component {
    render() {
        const { href, active } = this.props;
        if(active) return   <li className="active">
                                {this.props.children}
                            </li>

        return  <li>
                    <Link to={href}>
                        {this.props.children}
                    </Link>
                </li>

    }
}