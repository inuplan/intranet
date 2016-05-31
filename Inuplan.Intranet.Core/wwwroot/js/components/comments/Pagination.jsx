var Pagination = React.createClass({
    getPage: function (p) {
        this.props.getPage(p);
    },
    prevView: function() {
        var hasPrev = !(this.props.currentPage === 1);
        if (hasPrev)
            return (
                <li>
                  <a href="#" aria-label="Previous" onClick={this.props.prev}>
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>);
        else
            return (
                <li className="disabled">
                  <a href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>);
    },
    nextView: function() {
        var hasNext = !(this.props.totalPages === this.props.currentPage) && !(this.props.totalPages === 0);
        if(hasNext)
            return (
                <li>
                  <a href="#" aria-label="Next" onClick={this.props.next}>
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>);
        else
            return (
                <li className="disabled">
                  <a href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>);
    },
    render: function () {
        var pages = [];
        for (var i = 1; i <= this.props.totalPages; i++) {
            var key = this.props.imageId + i;
            if (i === this.props.currentPage) {
                pages.push(<li className="active" key={key}><a href="#" key={key }>{i}</a></li>);
            } else {
                pages.push(<li key={key } onClick={this.getPage.bind(this, i)}><a href="#" key={key }>{i}</a></li>);
            }
        }

        var show = (pages.length > 0);
        return (
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
            : null
        );
    }
});