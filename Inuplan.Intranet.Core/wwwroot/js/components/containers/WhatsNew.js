import React from 'react'
import { find } from 'underscore'
import { connect } from 'react-redux'
import { fetchLatestNews } from '../../actions/whatsnew'
import { WhatsNewList } from '../WhatsNew/WhatsNewList'
import { Row, Col } from 'react-bootstrap'
import { Pagination } from '../pagination/Pagination'

const mapStateToProps = (state) => {
    return {
        items: state.whatsNewInfo.items,
        getUser: (id) => find(state.usersInfo.users, (user) => {
            return user.ID == id;
        }),
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take,
        totalPages: state.whatsNewInfo.totalPages,
        page: state.whatsNewInfo.page
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLatest: (skip, take) => dispatch(fetchLatestNews(skip, take))
    }
}

class WhatsNewContainer extends React.Component {
    constructor(props) {
        super(props);
        this.pageHandle = this.pageHandle.bind(this);
    }

    pageHandle(to) {
        const { getLatest, page, take } = this.props;
        if(page == to) return;

        const skipPages = to - 1;
        const skipItems = (skipPages * take);
        getLatest(skipItems, take);
    }

    render() {
        const { items, getUser, totalPages, page } = this.props;
        return  <Row>
                    <Col lg={6}>
                        <h3>Sidste h&aelig;ndelser</h3>
                        <WhatsNewList
                            items={items}
                            getUser={getUser} />
                        <Pagination
                            totalPages={totalPages}
                            page={page}
                            pageHandle={this.pageHandle}
                        />
                    </Col>
                </Row>
    }
}

const WhatsNew = connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer)
export default WhatsNew;
