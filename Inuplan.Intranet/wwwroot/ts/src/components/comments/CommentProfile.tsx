import * as React from 'react'
import { Image, Media } from 'react-bootstrap'

export class CommentProfile extends React.Component<any, any> {
    render() {
        return  <Media.Left className="comment-profile">
                    <Image
                        src="/images/person_icon.svg"
                        style={{ width: "64px", height: "64px" }}
                        className="media-object"
                    />
                    {this.props.children}
                </Media.Left>
    }
}