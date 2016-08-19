import React from 'react'
import { Image } from './Image'

const elementsPerRow = 4;

export default class ImageList extends React.Component {
    arrangeArray(images) {
        const length = images.length;
        const times = Math.ceil(length / elementsPerRow);

        let result = [];
        let start = 0;
        for (var i = 0; i < times; i++) {
            start = i * elementsPerRow;
            const end = start + elementsPerRow;
            const last = end > length;
            if(last) {
                const row = images.slice(start);
                result.push(row);
            } else {
                const row = images.slice(start, end);
                result.push(row);
            }
        }

        return result;
    }

    imagesView(images) {
        if(images.length == 0) return null;
        const { addSelectedImageId, removeSelectedImageId, deleteSelectedImages, canEdit, imageIsSelected, username } = this.props;
        const result = this.arrangeArray(images);
        const view = result.map((row, i) => {
            const imgs = row.map((img) => {
                return (
                    <div className="col-lg-3" key={img.ImageID}>
                        <Image
                            image={img}
                            canEdit={canEdit}
                            addSelectedImageId={addSelectedImageId}
                            removeSelectedImageId={removeSelectedImageId}
                            imageIsSelected={imageIsSelected}
                            username={username}
                        />
                    </div>
                );
            });

            const rowId = "rowId" + i;
            return (
                <div className="row" key={rowId}>
                    {imgs}
                </div>
            );
        });

        return view;
    }


    render() {
        const { images } = this.props;
        return (
        <div className="row">
            {this.imagesView(images)}
        </div>);
    }
}