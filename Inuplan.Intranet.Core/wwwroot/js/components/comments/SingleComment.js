import React from 'react'
import { Comment } from './Comment'
import { connect } from 'react-redux'
import { Well, Button, Glyphicon } from 'react-bootstrap'
import { find } from 'underscore'
import { withRouter } from 'react-router'
import { objMap } from '../../utilities/utils'

const mapStateToProps = (state) => {
    const { comments, focusedComment } = state.commentsInfo;
    const { users } = state.usersInfo;
    const { ownerId, selectedImageId } = state.imagesInfo;

    return {
        getName: (id) => {
            const author = users[id];
            return `${author.FirstName} ${author.LastName}`;
        },
        focusedId: focusedComment,
        focused: comments[0],
        imageId: selectedImageId,
        imageOwner: users[ownerId].Username
    }
}

class SingleCommentRedux extends React.Component {
    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
    }

    reload() {
        const { imageId, imageOwner } = this.props;
        const { push } = this.props.router;

        const path = `/${imageOwner}/gallery/image/${imageId}/comments`;
        push(path);
    }

    render() {
        const { focusedId } = this.props;
        if(focusedId < 0) return null;

        const { Text, AuthorID, CommentID, PostedOn } = this.props.focused;
        const name = this.props.getName(AuthorID);

        return  <div className="text-left">
                    <Well>
                        <Comment
                            name={name}
                            text={Text}
                            commentId={CommentID}
                            replies={[]}
                            authorId={AuthorID}
                            postedOn={PostedOn}
                        />
                    </Well>
                    <div>
                        <p className="text-center">
                            <Button onClick={this.reload}>
                                <Glyphicon glyph="refresh"/> Se alle kommentarer?
                            </Button>
                        </p>
                    </div>
                </div>
    }
}

const SingleCommentConnect = connect(mapStateToProps, null)(SingleCommentRedux);
export const SingleComment = withRouter(SingleCommentConnect);
