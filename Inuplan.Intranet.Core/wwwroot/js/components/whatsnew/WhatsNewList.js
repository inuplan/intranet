import React from 'react'
import { WhatsNewItemImage } from './WhatsNewItemImage'
import { WhatsNewItemComment } from './WhatsNewItemComment'
import { WhatsNewForumPost } from './WhatsNewForumPost'
import { Media } from 'react-bootstrap'

export class WhatsNewList extends React.Component {
    constructItems() {
        const { items, getUser } = this.props;
        const generateKey = (id) => "whatsnew_" + id;
        return items.map(item => {
            const itemKey = generateKey(item.ID);
            const author = getUser(item.AuthorID);
            switch (item.Type) {
                case 1:
                    return  <WhatsNewItemImage
                                id={item.ID}
                                on={item.On}
                                imageId={item.Item.ImageID}
                                filename={item.Item.Filename}
                                extension={item.Item.Extension}
                                thumbnail={item.Item.ThumbnailUrl}
                                preview={item.Item.PreviewUrl}
                                author={author}
                                key={itemKey}
                            />
                case 2:
                    return  <WhatsNewItemComment
                                id={item.ID}
                                commentId={item.Item.ID}
                                text={item.Item.Text}
                                uploadedBy={item.Item.ImageUploadedBy}
                                imageId={item.Item.ImageID}
                                on={item.On}
                                author={author}
                                filename={item.Item.Filename}
                                key={itemKey}
                            />
                case 4:
                    return  <WhatsNewForumPost
                                on={item.On}
                                author={author}
                                title={item.Item.Title}
                                text={item.Item.Text}
                                sticky={item.Item.Sticky}
                                postId={item.Item.ID}
                                commentCount={item.Item.CommentCount}
                                key={itemKey}
                            />
            }
        })
    }

    render() {
        const itemNodes = this.constructItems();
        return  <Media.List>
                    {itemNodes}
                </Media.List>
    }
}
