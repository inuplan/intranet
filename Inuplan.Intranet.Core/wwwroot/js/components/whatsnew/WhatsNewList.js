import React from 'react'
import { WhatsNewItemImage } from './WhatsNewItemImage'
import { WhatsNewItemComment } from './WhatsNewItemComment'

export class WhatsNewList extends React.Component {
    constructItems() {
        const { items, getUser } = this.props;
        return items.map(item => {
            const author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    return  <WhatsNewItemImage
                                id={item.ID}
                                item={item.Item}
                                on={item.On}
                                author={author}
                            />
                case 2:
                    return  <WhatsNewItemComment
                                id={item.ID}
                                item={item.Item}
                                on={item.On}
                                author={author}
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