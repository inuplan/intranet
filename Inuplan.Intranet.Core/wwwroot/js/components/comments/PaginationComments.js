import React from 'react'
import { Pagination } from 'react-bootstrap'

export class PaginationComments extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(to) {
        const { navigateTo, username, imageId, page } = this.props;
        if(page == to) return;

        const url = `/${username}/gallery/image/${imageId}/comments?page=${to}`;
        navigateTo(url);
    }

    render() {
        const { totalPages, page } = this.props;
        if(totalPages <= 1) return null;

        return  <Pagination
                    prev next first last ellipsis boundaryLinks
                    items={totalPages}
                    maxButtons={5}
                    activePage={page}
                    onSelect={this.handleSelect}
                />
    }
}            