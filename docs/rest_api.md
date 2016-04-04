| Method          | Path                                               |       Description                                                                      |
|-----------------|----------------------------------------------------|----------------------------------------------------------------------------------------|
| POST            | {user}/image                                       | Upload an image to the users folder                                                    |
| GET             | {user}/image/{id}/{file                            | Retrieves the image file                                                               |
| GET             | {user}/image/{id}/preview/{file}                   | Gets a preview of an image                                                             |
| GET             | {user/image/{id}/thumbnail/{file}                  | Gets a thumbnail of an image                                                           |
| GET             | {user}/image                                       | Get all images that a user has, in a json description. With an optional argument       |
|                 |                                                    | If true, comments will be populated otherwise, only images will be fetched.            |
| GET             | image/id/{id}                                      | Gets the image with that id                                                            |
| DELETE          | {user}/image/{id}/{file}                           | Deletes an image file from the users collection                                        |
| \*POST          | {user}/image/profile                               | Uploads the profile image [deprecated]                                                 |
| \*GET           | {user}/image/profile                               | Gets the user's image profile [deprecated]                                             |
