import React from 'react'
import { Pagination as PaginationBs } from 'react-bootstrap'

export class Pagination extends React.Component {
    render() {
        const { totalPages, page, pageHandle } = this.props;
        if(totalPages <= 1) return null;

        return  <PaginationBs
                    prev next first last ellipsis boundaryLinks
                    items={totalPages}
                    maxButtons={5}
                    activePage={page}
                    onSelect={pageHandle}
                />
    }
}            