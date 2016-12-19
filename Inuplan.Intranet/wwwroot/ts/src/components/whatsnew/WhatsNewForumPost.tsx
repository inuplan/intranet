import * as React from 'react'
import { WhatsNewTooltip } from './WhatsNewTooltip'
import { CommentProfile } from '../comments/CommentProfile'
import { getWords, timeText } from '../../utilities/utils'
import { Media, Glyphicon, Tooltip } from 'react-bootstrap'
import { Data } from '../../interfaces/Data'

interface stateProps {
    on: Date
    author: Data.User
    title: string
    text: string
    sticky: boolean
    commentCount: number
    preview: (index: number) => void
    index: number
}

export class WhatsNewForumPost extends React.Component<stateProps, any> {
    constructor(props: any) {
        super(props);
        this.showModal = this.showModal.bind(this);
    }

    fullname() {
        const { author } = this.props;
        return author.FirstName + ' ' + author.LastName;
    }

    when() {
        const { on } = this.props;
        return "indlæg " + timeText(on);
    }

    summary() {
        const { text } = this.props;
        return getWords(text, 5);
    }

    overlay() {
        const { commentCount } = this.props;
        return <Tooltip id="tooltip_post">Forum indl&aelig;g, antal kommentarer: {commentCount}</Tooltip>
    }

    showModal(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();

        const { preview, index } = this.props;
        preview(index);
    }

    render() {
        const { title } = this.props;
        const name = this.fullname();
         return <WhatsNewTooltip tooltip="Forum indlæg">
                    <Media.ListItem className="whatsnewItem hover-shadow">
                        <CommentProfile />
                        <Media.Body>
                            <blockquote>
                                <a href="#" onClick={this.showModal}>{this.summary()}...</a>
                                <footer>{name} {this.when()}<br /><Glyphicon glyph="list-alt" /> {title}</footer>
                            </blockquote>
                        </Media.Body>
                    </Media.ListItem>
                </WhatsNewTooltip>
    }
}