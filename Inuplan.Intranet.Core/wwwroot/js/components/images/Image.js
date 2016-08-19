import React from 'react'
import { Link } from 'react-router'

export class Image extends React.Component {
    constructor(props) {
        super(props);

        // Bind 'this' to functions
        this.checkboxHandler = this.checkboxHandler.bind(this);
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
        const style = count == 0 ? "col-lg-6 text-muted" : "col-lg-6 text-primary";
        const props = {
            className: style
        };

        return  <div {... props}>
                    <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}   
                </div>
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
    const { image, username } = this.props;
    let count = image.CommentCount;
    return  <div>
                <Link to={`/${username}/gallery/image/${image.ImageID}`}>
                    <img src={image.PreviewUrl} className="img-thumbnail" />
                </Link>
                <div className="row">
                    <Link to={`/${username}/gallery/image/${image.ImageID}`}>
                        {this.commentIcon(count)} 
                    </Link>
                    {this.checkboxView()}
                </div>
            </div>
    }
}
                //<a onClick={this.selectImage} style={{cursor: "pointer", textDecoration: "none"}}>
                //</a>

        //return ( count == 0 ?
        //    <div className="col-lg-6 text-muted"> 
        //        <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
        //    </div>
        //    :
        //    <div className="col-lg-6 text-primary" style={{ cursor: 'pointer' }}>
        //        <span className="glyphicon glyphicon-comment" aria-hidden="true"></span> {count}
        //    </div>
        //);