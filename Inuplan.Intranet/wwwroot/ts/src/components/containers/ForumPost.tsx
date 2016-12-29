import * as React from "react";
import { ForumForm } from "../forum/ForumForm";
import { ButtonTooltip } from "../comments/CommentControls";
import { markPost, updatePost, fetchPost, deletePost, setSelectedThread } from "../../actions/forum";
import { find, contains } from "underscore";
import {  getFullName, formatText } from "../../utilities/utils";
import { Row, Col, Glyphicon, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { withRouter, InjectedRouter } from "react-router";
import { connect, Dispatch } from "react-redux";
import { Root } from "../../interfaces/State";
import { Data } from "../../interfaces/Data";
import * as moment from "moment";

interface StateToPropsPost {
    selected: number;
    title: Data.ForumTitle;
    text: string;
    getUser: (id: number) => Data.User;
    canEdit: (id: number) => boolean;
    hasRead: boolean;
}

interface DispatchToPropsPost {
    update: (id: number, post: Partial<Data.Raw.Models.ThreadPostContent>, cb: () => void) => void;
    getPost: (id: number) => any;
    deletePost: (id: number, cb: Function) => void;
    readPost: (postId: number, read: boolean, cb: Function) => void;
}

const mapStateToProps = (state: Root): StateToPropsPost => {
    const selected = state.forumInfo.titlesInfo.selectedThread;
    const title = find(state.forumInfo.titlesInfo.titles, (title) => title.ID === selected);
    return {
        selected: selected,
        title: title,
        text: state.forumInfo.postContent,
        getUser: (id) => state.usersInfo.users[id],
        canEdit: (id) => state.usersInfo.currentUserId === id,
        hasRead: title ? contains(title.ViewedBy, state.usersInfo.currentUserId) : false,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchToPropsPost => {
    return {
        update: (id: number, post: Partial<Data.Raw.Models.ThreadPostContent>, cb: () => void) => {
            dispatch(updatePost(id, post, cb));
        },
        getPost: (id: number) => {
            dispatch(fetchPost(id))
            .then(() => dispatch(setSelectedThread(id)));
        },
        deletePost: (id: number, cb: () => void) => {
            dispatch(deletePost(id, cb));
        },
        readPost: (postId: number, read: boolean, cb: () => void) => {
            dispatch(markPost(postId, read, cb));
        }
    };
};

interface ComponentState {
    edit?: boolean;
    model?: {
        Title: string
        Text: string
        Sticky: boolean
        IsPublished: boolean
    };
}

class ForumPostContainer extends React.Component<StateToPropsPost & DispatchToPropsPost & { router: InjectedRouter }, ComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            edit: false
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
        this.togglePostRead = this.togglePostRead.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        const hasTitle = Boolean(nextProps.title);
        if (!hasTitle) return;

        this.setState({
            model: {
                Title: nextProps.title.Title,
                Text: nextProps.text,
                Sticky: nextProps.title.Sticky,
                IsPublished: nextProps.title.IsPublished
            },
        });

        document.title = nextProps.title.Title;
    }

    deleteHandle() {
        const { router, deletePost, title } = this.props;
        const cb = () => {
            const forumlists = `/forum`;
            router.push(forumlists);
        };

        deletePost(title.ID, cb);
    }

    toggleEdit() {
        const edit = this.state.edit;
        this.setState({ edit: !edit });
    }

    onSubmit(post: Partial<Data.Raw.Models.ThreadPostContent>) {
        const { update, getPost, title } = this.props;
        const cb = () => {
            getPost(title.ID);
        };

        update(title.ID, post, cb);
    }

    togglePostRead(toggle: boolean) {
        const { getPost, readPost, title } = this.props;
        const cb = () => {
            getPost(title.ID);
        };

        readPost(title.ID, toggle, cb);
    }

    close() {
        this.setState({ edit: false });
    }

    render() {
        const { canEdit, selected, title, text, getUser, hasRead } = this.props;
        if (selected < 0 || !title) return null;

        const edit = canEdit(title.AuthorID);
        const user = getUser(title.AuthorID);
        const author = getFullName(user);
        return  <Row>
                    <ForumHeader lg={12} name={author} title={title.Title} createdOn={title.CreatedOn} modifiedOn={title.LastModified}>
                        <ForumButtonGroup
                            show={true}
                            editable={edit}
                            initialRead={hasRead}
                            onDelete={this.deleteHandle}
                            onEdit={this.toggleEdit}
                            onRead={this.togglePostRead.bind(this, true)}
                            onUnread={this.togglePostRead.bind(this, false)} />
                    </ForumHeader>
                    <ForumBody text={text} lg={10}>
                        <hr />
                        {this.props.children}
                    </ForumBody>
                    <ForumForm
                        show={this.state.edit}
                        close={this.close.bind(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        edit={this.state.model} />
                </Row>;
    }
}

interface ForumBodyProps {
    text: string;
    lg?: number;
    lgOffset?: number;
}

export class ForumBody extends React.Component<ForumBodyProps, any> {
    render() {
        const { text, lg, lgOffset } = this.props;
        const formattedText = formatText(text);
        return  <Row>
                    <Col lg={lg} lgOffset={lgOffset}>
                        <p className="forum-content" dangerouslySetInnerHTML={formattedText}/>
                        <Row>
                            <Col lg={12}>
                                {this.props.children}
                            </Col>
                        </Row>
                    </Col>
                </Row>;
    }
}

interface ForumHeaderProps {
    createdOn?: Date;
    modifiedOn?: Date;
    title: string;
    name: string;
    lg?: number;
    lgOffset?: number;
}

export class ForumHeader extends React.Component<ForumHeaderProps, any> {
    getCreatedOnText(createdOn: Date, modifiedOn: Date) {
        const date = moment(createdOn);
        const dateText = date.format("D-MM-YY");
        const timeText = date.format(" H:mm");
        if (!modifiedOn)
            return `Udgivet ${dateText} kl. ${timeText}`;

        const modified = moment(modifiedOn);
        const modifiedDate = modified.format("D-MM-YY");
        const modifiedTime = modified.format("H:mm");
        return `Udgivet ${dateText} kl. ${timeText} ( rettet ${modifiedDate} kl. ${modifiedTime} )`;
    }

    render() {
        const { title, name, createdOn, modifiedOn, lg, lgOffset } = this.props;
        const created = this.getCreatedOnText(createdOn, modifiedOn);
        const props = { lg: lg, lgOffset: lgOffset };
        return  <Row>
                    <Col {...props}>
                        <h3>
                            <span className="text-capitalize">{title}</span><br />
                            <small>Skrevet af {name}</small>
                        </h3>
                        <small className="text-primary"><Glyphicon glyph="time" /> {created}</small>
                        <Row>
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>;

    }
}

interface ForumButtonGroupProps {
    show: boolean;
    editable: boolean;
    initialRead: boolean;
    onDelete: () => void;
    onEdit: (e: React.MouseEvent<any>) => void;
    onRead: () => void;
    onUnread: () => void;
}

interface ForumButtonGroupState {
    read: boolean;
}

// props: { show, editable, initialRead, onDelete, onEdit, onRead, onUnread }
export class ForumButtonGroup extends React.Component<ForumButtonGroupProps, ForumButtonGroupState> {
    constructor(props: any) {
        super(props);
        this.state = {
            read: props.initialRead
        };

        this.readHandle = this.readHandle.bind(this);
        this.unreadHandle = this.unreadHandle.bind(this);
    }

    readHandle() {
        const { onRead } = this.props;
        if (this.state.read) return;

        this.setState({ read: true });
        onRead();
    }

    unreadHandle() {
        const { onUnread } = this.props;
        if (!this.state.read) return;

        this.setState({ read: false });
        onUnread();
    }

    render() {
        const { editable, show, onDelete, onEdit } = this.props;
        if (!show) return null;

        const { read } = this.state;
        return  <Col lg={12} className="forum-editbar">
                    <ButtonToolbar>
                        <ButtonGroup>
                            <ButtonTooltip bsStyle="danger" onClick={onDelete} icon="trash" tooltip="slet indlæg" mount={editable} />
                            <ButtonTooltip bsStyle="primary" onClick={onEdit} icon="pencil" tooltip="ændre indlæg" active={false} mount={editable} />
                            <ButtonTooltip bsStyle="primary" onClick={this.readHandle} icon="eye-open" tooltip="marker som læst" active={read} mount={true} />
                            <ButtonTooltip bsStyle="primary" onClick={this.unreadHandle} icon="eye-close" tooltip="marker som ulæst" active={!read} mount={true} />
                        </ButtonGroup>
                    </ButtonToolbar>
                </Col>;
    }
}

const ForumPostRedux = connect(mapStateToProps, mapDispatchToProps)(ForumPostContainer);
const ForumPost = withRouter(ForumPostRedux);
export default ForumPost;