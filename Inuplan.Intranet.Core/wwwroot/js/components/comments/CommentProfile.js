import React from 'react'

export class CommentProfile extends React.Component {
    render() {
        return (
            <div className="media-left">
                <img className="media-object"
                    src="/images/person_icon.svg"
                    data-holder-rendered="true"
                    style={{ width: "64px", height: "64px" }}
                />
                {this.props.children}
            </div>);
    }
}
