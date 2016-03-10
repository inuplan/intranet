Method          | Path                                               |       Description
-----------------------------------------------------------------------------------------
POST            | {user}/image                                       | Upload an image to the users folder
GET             | {user}/image/{file}                                | Retrieves the image file
GET             | {user}/image/preview/{file}                        | Gets a preview of an image
GET             | {user/image/thumbnail/{file}                       | Gets a thumbnail of an image
GET             | {user}/image?comments={bool}                       | Get all images that a user has, in a json description. With an optional argument
                |                                                    | If true, comments will be populated otherwise, only images will be fetched.
GET             | image/id/{id}                                      | Gets the image with that id
POST            | {user}/image/profile                               | Uploads the profile image
GET             | {user}/image/profile                               | Gets the user's image profile
