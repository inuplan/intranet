import React from 'react'
import { ForumForm } from '../forum/ForumForm'
import { ButtonTooltip } from '../comments/CommentControls'
import { markPost, updatePost, fetchPost, deletePost } from '../../actions/forum'
import { postComment } from '../../actions/comments'
import { find, contains } from 'underscore'
import { getFullName, timeText, formatText } from '../../utilities/utils'
import { Row, Col, Glyphicon, ButtonToolbar, ButtonGroup } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    const selected = state.forumInfo.titlesInfo.selectedThread;
    const title = find(state.forumInfo.titlesInfo.titles, (title) => title.ID == selected);
    return {
        selected: selected,
        title: title,
        text: state.forumInfo.postContent,
        getUser: (id) => state.usersInfo.users[id],
        canEdit: (id) => state.usersInfo.currentUserId == id,
        hasRead: title ? contains(title.ViewedBy, state.usersInfo.currentUserId) : false,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        update: (id, post, cb) => {
            dispatch(updatePost(id, post, cb));
        },
        getPost: (id) => {
            dispatch(fetchPost(id));
        },
        deletePost: (id, cb) => {
            dispatch(deletePost(id, cb));
        },
        readPost: (postId, read, cb) => {
            dispatch(markPost(postId, read, cb));
        },
    }
}

class ForumPostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            hasRead: false
        };
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
        this.togglePostRead = this.togglePostRead.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const hasTitle = Boolean(nextProps.title);
        if(!hasTitle) return;

        this.setState({
            model: {
                Title: nextProps.title.Title,
                Text: nextProps.text,
                Sticky: nextProps.title.Sticky,
                IsPublished: nextProps.title.IsPublished
            },
            hasRead: nextProps.hasRead
        });

        document.title = nextProps.title.Title;
    }

    getCreatedOnText(createdOn, modifiedOn) {
        const date = moment(createdOn);
        const dateText = date.format("D-MM-YY");
        const timeText = date.format(" H:mm");
        if(!modifiedOn)
            return `Udgivet ${dateText} kl. ${timeText}`;

        const modified = moment(modifiedOn);
        const modifiedDate = modified.format("D-MM-YY");
        const modifiedTime = modified.format(" H:mm");
        return `Udgivet ${dateText} kl. ${timeText} ( rettet ${modifiedDate} kl. ${modifiedTime} )`;
    }

    deleteHandle() {
        const { router, deletePost, title } = this.props;
        const { ID } = title;
        const cb = () => {
            const forumlists = `/forum`;
            router.push(forumlists);
        }
        deletePost(ID, cb);
    }

    toggleEdit() {
        const edit = this.state.edit;
        this.setState({ edit: !edit });
    }

    onSubmit(post) {
        const { update, getPost, title } = this.props;
        const cb = () => {
            getPost(title.ID);
        };

        update(title.ID, post, cb);
    }

    togglePostRead() {
        const { getPost, readPost, title, hasRead } = this.props;
        const read = !hasRead;
        this.setState({
            hasRead: read
        });

        const cb = () => {
            getPost(title.ID);
        }

        readPost(title.ID, read, cb);
    }

    editButtonGroups(edit) {
        const read = this.state.hasRead;
        return  <ButtonToolbar>
                    <ButtonGroup>
                        <ButtonTooltip bsStyle="danger" onClick={this.deleteHandle} icon="trash" tooltip="slet indlæg" mount={edit} />
                        <ButtonTooltip bsStyle="primary" onClick={this.toggleEdit} icon="pencil" tooltip="ændre indlæg" active={false} mount={edit} />
                        <ButtonTooltip bsStyle="primary" onClick={this.togglePostRead} icon="eye-open" tooltip="marker som læst" active={read} mount={true} />
                        <ButtonTooltip bsStyle="primary" onClick={this.togglePostRead} icon="eye-close" tooltip="marker som ulæst" active={!read} mount={true} />
                    </ButtonGroup>
                </ButtonToolbar>
    }

    close() {
        this.setState({ edit: false });
    }

    render() {
        const { canEdit, selected, title, text, getUser } = this.props;
        if(selected < 0 || !title) return null;

        const edit = canEdit(title.AuthorID);
        const createdOnText = this.getCreatedOnText(title.CreatedOn, title.LastModified);
        const user = getUser(title.AuthorID);
        const author = getFullName(user);
        const formattedText = formatText(text);
        return  <Row>
                    <Row>
                        <Col lg={12}>
                            <h3>
                                <span className="text-capitalize">{title.Title}</span><br />
                                <small>Skrevet af {author}</small>
                            </h3>
                            <small className="text-primary"><Glyphicon glyph="time" /> {createdOnText}</small>
                            <Row>
                                <Col lg={12} className="forum-editbar">
                                    {this.editButtonGroups(edit)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Row>
                            <Col lg={10}>
                                <p className="forum-content" dangerouslySetInnerHTML={formattedText}/>
                                <Row>
                                    <Col lg={12}>
                                        {this.props.children}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Row>
                    <ForumForm
                        show={this.state.edit}
                        close={this.close.bind(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        edit={this.state.model} />
                </Row>
    }
}

const ForumPostRedux = connect(mapStateToProps, mapDispatchToProps)(ForumPostContainer);
const ForumPost = withRouter(ForumPostRedux);
export default ForumPost;
