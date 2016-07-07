import React from 'react'

export class Image extends React.Component {
    constructor(props) {
        super(props);

        // Bind 'this' to functions
        this.selectImage = this.selectImage.bind(this);
        this.checkboxHandler = this.checkboxHandler.bind(this);
    }

    selectImage() {
        const { selectImage, image } = this.props;
        selectImage(image.ImageID);
    }

    checkboxHandler(e) {
        const { image } = this.props;
        const add = e.currentTarget.checked;
        if(add) {
            const { addSelectedImageId } = this.props;
            addSelectedImageId(image.ImageID);
        }
        else {
            const { removeSelectedImageId } = this.props;
            removeSelectedImageId(image.ImageID);
        }
    }

    commentIcon(count) {
        return ( count == 0 ?
            <div className="col-lg-6 text-muted" onClick={this.selectImage} style={{ cursor: 'pointer' }}> 
                <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
            </div>
            :
            <div className="col-lg-6 text-primary" onClick={this.selectImage} style={{ cursor: 'pointer' }}>
                <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
            </div>
        );
    }

    checkboxView() {
        const { canEdit, imageIsSelected, image } = this.props;
        const checked = imageIsSelected(image.ImageID);
        return (canEdit ? 
            <div className="col-lg-6 pull-right text-right">
                <label>
                    Slet <input type="checkbox" onClick={this.checkboxHandler} checked={checked} /> 
                </label>
            </div>
            : null);
    }

    render() {
        const { image } = this.props;
        let count = image.CommentCount;
        return (
            <div>
                <a onClick={this.selectImage} style={{cursor: "pointer", textDecoration: "none"}}>
                    <img src={image.PreviewUrl} className="img-thumbnail" />
                </a>
                <div className="row">
                    {this.commentIcon(count)} 
                    {this.checkboxView()}
                </div>
            </div>
        );
    }
}