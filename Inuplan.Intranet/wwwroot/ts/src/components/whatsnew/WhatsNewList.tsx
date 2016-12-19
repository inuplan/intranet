import * as React from 'react'
import { WhatsNewItemImage } from './WhatsNewItemImage'
import { WhatsNewItemComment } from './WhatsNewItemComment'
import { WhatsNewForumPost } from './WhatsNewForumPost'
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
        const { items, getUser } = this.props;
        const generateKey = (id:number) => "whatsnew_" + id;
        return items.map( (item ,index ) => {
            const itemKey = generateKey(item.ID);
            const author = getUser(item.AuthorID);
            switch (item.Type) {
                case Data.WhatsNewType.Image:
                {
                    const image = item.Item as Data.WhatsNewImage;
                    return  <WhatsNewItemImage
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
                    const comment = item.Item as Data.WhatsNewComment;
                    return  <WhatsNewItemComment
                                commentId={comment.ID}
                                text={comment.Text}
                                uploadedBy={comment.ImageUploadedBy}
                                imageId={comment.ImageID}
                                filename={comment.Filename}
                                on={item.On}
                                author={author}
                                key={itemKey}
                            />
                }
                case Data.WhatsNewType.ForumPost:
                {
                    const post = item.Item as Data.WhatsNewForumPost;
                    return  <WhatsNewForumPost
                                on={item.On}
                                author={author}
                                title={post.Title}
                                text={post.Text}
                                sticky={post.Sticky}
                                commentCount={post.CommentCount}
                                preview={this.previewPostHandle}
                                index={index}
                                key={itemKey}
                            />
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