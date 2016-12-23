import * as React from 'react'
import { Image } from './Image'
import { Row, Col } from 'react-bootstrap'
import { Components } from '../../interfaces/Components'
import { Data } from '../../interfaces/Data'

const elementsPerRow = 4;

export default class ImageList extends React.Component<Components.imageList, null> {
    arrangeArray(images: Data.Image[]) {
        const length = images.length;
        const times = Math.ceil(length / elementsPerRow);

        let result: Array<Data.Image[]> = [];
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

    imagesView(images: Data.Image[]) {
        if(images.length == 0) return null;
        const { addSelectedImageId, removeSelectedImageId, canEdit, imageIsSelected, username } = this.props;
        const result = this.arrangeArray(images);
        const view = result.map((row, i) => {
            const imgs = row.map((img) => {
                return  <Col lg={3} key={img.ImageID}>
                            <Image
                                image={img}
                                canEdit={canEdit}
                                addSelectedImageId={addSelectedImageId}
                                removeSelectedImageId={removeSelectedImageId}
                                imageIsSelected={imageIsSelected}
                                username={username}
                            />
                        </Col>
            });

            const rowId = "rowId" + i;
            return  <Row key={rowId}>
                        {imgs}
                    </Row>
        });

        return view;
    }


    render() {
        const { images } = this.props;
        return  <Row>
                    {this.imagesView(images)}
                </Row>
    }
}