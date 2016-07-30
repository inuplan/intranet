import React from 'react'
import { connect } from 'react-redux'
import { fetchLatestNews } from '../../actions/whatsnew'
import { WhatsNewList } from '../WhatsNew/WhatsNewList'

const mapDispatchToProps = (dispatch) => {
    return {
        getLatest: (skip, take) => dispatch(fetchLatestNews(skip, take))
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.whatsNewInfo.items,
        getUser: (id) => state.usersInfo.users.filter(u => u.ID == id)[0],
        skip: state.whatsNewInfo.skip,
        take: state.whatsNewInfo.take
    }
}

class WhatsNewContainer extends React.Component {
    componentDidMount() {
        const { getLatest, skip, take } = this.props;
        getLatest(skip, take);
    }

    render() {
        const { items, getUser } = this.props;
        return  <div>
                    <h3>Sidste nyt</h3>
                    <WhatsNewList
                        items={items}
                        getUser={getUser}
                    />
                </div>
    }
}

const WhatsNew = connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer)
export default WhatsNew;