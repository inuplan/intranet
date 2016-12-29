import * as React from "react";
import { Link } from "react-router";
import { Components } from "../../interfaces/Components";

export class Breadcrumb extends React.Component<null, null> {
    render() {
        return  <ol className="breadcrumb">
                    {this.props.children}
                </ol>;
    }
}

export namespace Breadcrumb {
    export class Item extends React.Component<Components.BreadcrumbItem, null> {
        render() {
            const { href, active } = this.props;
            if (active) return <li className="active">
                {this.props.children}
            </li>;

            return <li>
                <Link to={href}>
                    {this.props.children}
                </Link>
            </li>;
        }
    }
}