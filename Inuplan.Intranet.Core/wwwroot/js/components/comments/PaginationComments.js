import React from 'react'
import { Pagination } from 'react-bootstrap'

export class PaginationComments extends React.Component {
    render() {
        const { totalPages, page, pageHandle } = this.props;
        if(totalPages <= 1) return null;

        return  <Pagination
                    prev next first last ellipsis boundaryLinks
                    items={totalPages}
                    maxButtons={5}
                    activePage={page}
                    onSelect={pageHandle}
                />
    }
}            