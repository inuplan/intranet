import React from 'react'
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap'
import { ForumTitle } from '../forum/ForumTitle'
import { connect } from 'react-redux'
import { find } from 'underscore'
import { fetchThreads, postThread, setSelectedThread } from '../../actions/forum'
import { Pagination } from '../pagination/Pagination'
import { ForumForm } from '../forum/ForumForm'

const mapStateToProps = (state) => {
    return {
        threads: state.forumInfo.titlesInfo.titles,
        skip: state.forumInfo.titlesInfo.skip,
        take: state.forumInfo.titlesInfo.take,
        page: state.forumInfo.titlesInfo.page,
        totalPages: state.forumInfo.titlesInfo.totalPages,
        getAuthor: (id) => {
            const user = state.usersInfo.users[id];
            return `${user.FirstName} ${user.LastName}`;
        },
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchThreads: (skip, take) => {
            dispatch(fetchThreads(skip, take));
        },
        postThread: (cb, post) => {
            dispatch(postThread(cb, post));
        },
        setSelectedThread: (id) => {
            dispatch(setSelectedThread(id));
        }
    }
}

class ForumListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPost: false
        };

        this.pageHandle = this.pageHandle.bind(this);
        this.close = this.close.bind(this);
    }

    pageHandle(to) {
        const { fetchThreads, page, take } = this.props;

        if(page == to) return;
        const skipItems = (to - 1) * take;
        fetchThreads(skipItems, take);
    }

    threadViews() {
        const { threads, getAuthor, setSelectedThread } = this.props;
        return threads.map(thread => {
            const id = `thread_${thread.ID}`;
            return <ForumTitle
                        title={thread}
                        key={id}
                        getAuthor={getAuthor} />
        });
    }

    submit(post) {
        const { postThread, fetchThreads, skip, take } = this.props;
        postThread(() => fetchThreads(skip, take), post);
    }

    close() {
        this.setState({ newPost: false });
    }

    show() {
        this.setState({ newPost: true });
    }

    render() {
        const { totalPages, page } = this.props;
        return  <Row>
                    <ButtonGroup>
                        <Button bsStyle="primary" onClick={this.show.bind(this)}>Tilf&oslash;j nyt indl&aelig;g</Button>
                    </ButtonGroup>
                    <Col lg={12}>
                        <Row className="thread-head">
                            <Col lg={1}>
                                <strong>Info</strong>
                            </Col>
                            <Col lg={5}>
                                <strong>Titel</strong>
                            </Col>
                            <Col lg={2} className="text-center">
                                <strong>Dato</strong>
                            </Col>
                            <Col lg={2} className="text-center">
                                <strong>Set af</strong>
                            </Col>
                            <Col lg={2} className="text-center">
                                <strong>Seneste kommentar</strong>
                            </Col>
                        </Row>
                        {this.threadViews()}
                        <Pagination totalPages={totalPages} page={page} pageHandle={this.pageHandle} show={true}/>
                    </Col>
                    <ForumForm
                        show={this.state.newPost}
                        close={this.close.bind(this)}
                        onSubmit={this.submit.bind(this)} />
                </Row>
    }
}

const ForumList = connect(mapStateToProps, mapDispatchToProps)(ForumListContainer);
export default ForumList;