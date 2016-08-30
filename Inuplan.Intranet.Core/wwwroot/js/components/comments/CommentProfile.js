﻿import React from 'react'
import { Image, Media } from 'react-bootstrap'

export class CommentProfile extends React.Component {
    render() {
        return  <Media.Left>
                    <Image
                        src="/images/person_icon.svg"
                        style={{ width: "64px", height: "64px" }}
                        className="media-object"
                    />
                    {this.props.children}
                </Media.Left>
    }
}