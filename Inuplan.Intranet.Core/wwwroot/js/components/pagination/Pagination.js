import React from 'react'
import { Pagination as PaginationBs } from 'react-bootstrap'

export class Pagination extends React.Component {
    render() {
        const { totalPages, page, pageHandle, show } = this.props;
        const more = totalPages => 1;
        const xor = (show || more) && !(show && more);
        if(!(xor || (show && more))) return null;

        return  <PaginationBs
                    prev next ellipsis boundaryLinks
                    items={totalPages}
                    maxButtons={5}
                    activePage={page}
                    onSelect={pageHandle}
                />
    }
}            