import * as React from 'react'
import { WhatsNewItemImage } from './WhatsNewItemImage'
//import { WhatsNewItemComment } from './WhatsNewItemComment'
//import { WhatsNewForumPost } from './WhatsNewForumPost'
import { Media } from 'react-bootstrap'
import { Data } from '../../interfaces/Data'

interface stateProps {
    items: Data.WhatsNew[]
    getUser: (id: number) => Data.User
    preview: (item: Data.WhatsNew) => void
}

export class WhatsNewList extends React.Component<stateProps, any> {
    constructor(props: any) {
        super(props);
        this.previewPostHandle = this.previewPostHandle.bind(this);
    }

    previewPostHandle(index: number) {
        const { items, preview } = this.props;
        const item = items[index];
        preview(item);
    }

    constructItems(): JSX.Element[] {
        const { items, getUser, /* preview */ } = this.props;
        const generateKey = (id:number) => "whatsnew_" + id;
        return items.map( (item /* ,index */): JSX.Element => {
            const itemKey = generateKey(item.ID);
            const author = getUser(item.AuthorID);
            switch (item.Type) {
                case Data.WhatsNewType.Image:
                {
                    const image = item.Item as Data.WhatsNewImage;
                    return  <WhatsNewItemImage
                                id={item.ID}
                                on={item.On}
                                imageId={image.ImageID}
                                filename={image.Filename}
                                extension={image.Extension}
                                thumbnail={image.ThumbnailUrl}
                                author={author}
                                key={itemKey}
                            />
                }
                case Data.WhatsNewType.Comment:
                {
                    return null;
                    //return  <WhatsNewItemComment
                    //            id={item.ID}
                    //            commentId={item.Item.ID}
                    //            text={item.Item.Text}
                    //            uploadedBy={item.Item.ImageUploadedBy}
                    //            imageId={item.Item.ImageID}
                    //            on={item.On}
                    //            author={author}
                    //            filename={item.Item.Filename}
                    //            key={itemKey}
                    //        />
                }
                case Data.WhatsNewType.ForumPost:
                {
                    return null;
                    //return  <WhatsNewForumPost
                    //            on={item.On}
                    //            author={author}
                    //            title={item.Item.Title}
                    //            text={item.Item.Text}
                    //            sticky={item.Item.Sticky}
                    //            postId={item.Item.ID}
                    //            commentCount={item.Item.CommentCount}
                    //            preview={this.previewPostHandle}
                    //            index={index}
                    //            key={itemKey}
                    //        />
                }
                default:
                {
                    return null;
                }
            }
        });
    }

    render() {
        const itemNodes = this.constructItems();
        return  <Media.List>
                    {itemNodes}
                </Media.List>
    }
}