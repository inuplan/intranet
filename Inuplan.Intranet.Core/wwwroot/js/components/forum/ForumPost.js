import React from 'react'
import { ForumForm } from './ForumForm'
import { ButtonTooltip } from '../comments/CommentControls'
import { updatePost, fetchPost, deletePost, setSelectedPostId } from '../../actions/forum'
import { find } from 'underscore'
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
        clearSelectedPostId: () => {
            dispatch(setSelectedPostId(-1));
        }
    }
}

class ForumPostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false
        };
        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const hasTitle = Boolean(nextProps.title);
        if(!hasTitle) return;

        this.setState({
            model: {
                Title: nextProps.title.Title,
                Text: nextProps.text,
                Sticky: nextProps.title.Sticky,
                IsPublished: nextProps.title.IsPublished,
            }
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
        const { router, deletePost, title, clearSelectedPostId } = this.props;
        const { ID } = title;
        const cb = () => {
            const forumlists = `/forum/threads`;
            clearSelectedPostId();
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

    editButtonGroups(edit) {
        return  <ButtonToolbar>
                    <ButtonGroup>
                        <ButtonTooltip bsStyle="danger" onClick={this.deleteHandle} icon="trash" tooltip="slet indlæg" mount={edit} />
                        <ButtonTooltip bsStyle="primary" onClick={this.toggleEdit} icon="pencil" tooltip="ændre indlæg" active={false} mount={edit} />
                        <ButtonTooltip bsStyle="primary" onClick={() => {}} icon="eye-open" tooltip="marker som læst" active={false} mount={true} />
                        <ButtonTooltip bsStyle="primary" onClick={() => {}} icon="eye-close" tooltip="marker som ulæst" active={false} mount={true} />
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
                        <Col lg={12}>
                            <Row>
                                <Col lg={10}>
                                    <p className="forum-content" dangerouslySetInnerHTML={formattedText}>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            {this.props.children}
                        </Col>
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
