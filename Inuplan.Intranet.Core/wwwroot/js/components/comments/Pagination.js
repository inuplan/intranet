import React from 'react'

export class Pagination extends React.Component {
    prevView() {
        const { currentPage, prev } = this.props;
        const hasPrev = !(currentPage === 1);
        if (hasPrev)
            return (
                <li>
                  <a href="#" aria-label="Previous" onClick={prev}>
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>);
        else
            return (
                <li className="disabled">
                    <span aria-hidden="true">&laquo;</span>
                </li>);
    }

    nextView() {
        const { totalPages, currentPage, next } = this.props;
        const hasNext = !(totalPages === currentPage) && !(totalPages === 0);
        if(hasNext)
            return (
                <li>
                  <a href="#" aria-label="Next" onClick={next}>
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>);
        else
            return (
                <li className="disabled">
                    <span aria-hidden="true">&raquo;</span>
                </li>);
    }

    render() {
        const { totalPages, imageId, currentPage, getPage } = this.props;
        let pages = [];
        for (var i = 1; i <= totalPages; i++) {
            const key = "page_item_" + (imageId + i);
            if (i === currentPage) {
                pages.push(<li className="active" key={key}><a href="#" key={key }>{i}</a></li>);
            } else {
                pages.push(<li key={key } onClick={getPage.bind(null, i)}><a href="#" key={key }>{i}</a></li>);
            }
        }

        const show = (pages.length > 0);

        return(
            show ?
            <div>
                <div className="col-lg-offset-1 col-lg-9">
                    <nav>
                      <ul className="pagination">
                          {this.prevView()}
                          {pages}
                          {this.nextView()}
                      </ul>
                    </nav>
                </div>
            </div>
            : null);
    }
}