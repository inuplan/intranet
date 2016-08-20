import React from 'react'
import { WhatsNewItemImage } from './WhatsNewItemImage'
import { WhatsNewItemComment } from './WhatsNewItemComment'

export class WhatsNewList extends React.Component {
    constructItems() {
        const { items, getUser } = this.props;
        const generateKey = (id) => "whatsnew_" + id;
        return items.map(item => {
            const author = getUser(item.AuthorID);
            const itemKey = generateKey(item.ID);
            switch (item.Type) {
                case 1:
                    return  <WhatsNewItemImage
                                id={item.ID}
                                item={item.Item}
                                on={item.On}
                                author={author}
                                key={itemKey}
                            />
                case 2:
                    return  <WhatsNewItemComment
                                id={item.ID}
                                text={item.Item.Text}
                                uploadedBy={item.Item.ImageUploadedBy}
                                imageId={item.Item.ImageID}
                                on={item.On}
                                author={author}
                                key={itemKey}
                            />
            }
        })
    }

    render() {
        const itemNodes = this.constructItems();
        return  <div className="media pull-left text-left">
                    {itemNodes}
                </div>
    }
}