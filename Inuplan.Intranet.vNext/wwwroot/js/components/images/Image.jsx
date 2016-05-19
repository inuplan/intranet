var Image = React.createClass({
    toggleModal: function () {
        this.props.modalHandle(this.props.data);
    },
    render: function () {
        return (
        <div>
            <a onClick={this.toggleModal}>
                <img src={this.props.data.PreviewUrl} className="img-thumbnail" />
            </a>
        </div>
        );
    }
});