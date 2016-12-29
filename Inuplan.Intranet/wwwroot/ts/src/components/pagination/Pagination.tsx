import * as React from "react";
import { Pagination as PaginationBs } from "react-bootstrap";

interface StateProps {
    totalPages: number;
    page: number;
    pageHandle: (to: number) => void;
    show?: boolean;
}

export class Pagination extends React.Component<StateProps, any> {
    render() {
        const { totalPages, page, pageHandle, show } = this.props;
        const more = totalPages > 1;
        const xor = (show || more) && !(show && more);
        if (!(xor || (show && more))) return null;

        return  <PaginationBs
                    prev next ellipsis boundaryLinks
                    items={totalPages}
                    maxButtons={5}
                    activePage={page}
                    onSelect={pageHandle as any}
                />;
    }
}