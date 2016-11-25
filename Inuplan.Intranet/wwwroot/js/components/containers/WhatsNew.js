import React from 'react'
import { values, sortBy } from 'underscore'
import { connect } from 'react-redux'
import { fetchLatestNews } from '../../actions/whatsnew'
import { WhatsNewList } from '../whatsnew/WhatsNewList'
import { ForumHeader, ForumBody } from './ForumPost'
import { Button, ButtonToolbar, Modal, Row, Col } from 'react-bootstrap'
import { Pagination } from '../pagination/Pagination'
import { Link, withRouter } from 'react-router'

const mapStateToProps = (state) => {
    return {
        items: state.whatsNewInfo.items,
        getUser: (id) => state.usersInfo.users[id],
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take,
        totalPages: state.whatsNewInfo.totalPages,
        page: state.whatsNewInfo.page,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLatest: (skip, take) => dispatch(fetchLatestNews(skip, take)),
    }
}

class WhatsNewContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            postPreview: null,
            author: {},
            on: null
        }

        this.pageHandle = this.pageHandle.bind(this);
        this.previewPost = this.previewPost.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modalView = this.modalView.bind(this);
        this.navigateTo = this.navigateTo.bind(this);
    }

    pageHandle(to) {
        const { getLatest, page, take } = this.props;
        if(page == to) return;

        const skipPages = to - 1;
        const skipItems = (skipPages * take);
        getLatest(skipItems, take);
    }

    previewPost(item) {
        const { getUser } = this.props;
        const author = getUser(item.AuthorID);
        this.setState({
            modal: true,
            postPreview: item.Item,
            author: author,
            on: item.On
        });
    }

    navigateTo(url) {
        const { push } = this.props.router;
        push(url);
    }

    closeModal() {
        this.setState({
            modal: false,
            postPreview: null,
            author: {},
            on: null
        });
    }

    modalView() {
        if(!Boolean(this.state.postPreview)) return null;
        const { Text, Title, ID } = this.state.postPreview;
        const author = this.state.author;
        const name = `${author.FirstName} ${author.LastName}`;
        const link = `forum/post/${ID}/comments`;

        return  <Modal show={this.state.modal} onHide={this.closeModal} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <ForumHeader
                                lg={11}
                                lgOffset={1}
                                createdOn={this.state.on}
                                title={Title}
                                name={name}
                            />
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ForumBody text={Text} lg={11} lgOffset={1}>
                        </ForumBody>
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonToolbar style={{float: "right"}}>
                            <Button bsStyle="primary" onClick={() => this.navigateTo(link)}>
                               Se kommentarer (forum)
                            </Button>
                            <Button onClick={this.closeModal}>Luk</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
    }

    render() {
        const { items, getUser, totalPages, page } = this.props;

        return  <Row>
                    <Col>
                        <h3>Sidste h&aelig;ndelser</h3>
                        <hr />
                        <WhatsNewList
                            items={items}
                            getUser={getUser}
                            preview={this.previewPost}
                        />
                        <Pagination
                            totalPages={totalPages}
                            page={page}
                            pageHandle={this.pageHandle}
                        />
                        {this.modalView()}
                    </Col>
                </Row>
    }
}

const WhatsNew = withRouter(connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer));
export default WhatsNew;
