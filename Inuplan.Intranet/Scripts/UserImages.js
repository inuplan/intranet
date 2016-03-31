function appViewModel(api, username) {
    var self = this;
    self.username = username;
    self.vm = new UserImagesViewModel(api, self);
}

function UserImagesViewModel(api, parent) {
    var self = this;

    // Helper functions
    self.get_api = api + parent.username + '/image';
    self.delete_api = function (filename) {
        return api + parent.username + '/image/' + filename;
    };

    // Data
    self.images = ko.observableArray([]);
    self.with_comments = ko.observable(true);
    var data = { comments: ko.unwrap(self.with_comments()) };

    // Functions
    $.ajax(self.get_api, {
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (result, status, jqXhr) {
            var images = $.map(result, function (item) {
                return new ImageViewModel(item, self);
            });
            self.images(images);
        }
    })
    //$.getJSON(self.get_api, data, function (allData) {
    //    var images = $.map(allData, function (item) {
    //        return new ImageViewModel(item, self);
    //    });
    //    self.images(images);
    //});
}

function ImageViewModel(data, parent) {
    var self = this;
    self.thumbnail_url = ko.observable(data.PathThumbnailUrl);
    self.original_url = ko.observable(data.PathOriginalUrl);
    self.preview_url = ko.observable(data.PathPreviewUrl);
    self.number_of_comments = ko.observable(numberOfComments(data.Comments));
    self.filename = ko.observable(data.Filename);
    self.extension = ko.observable(data.Extension);
    self.modal_id = ko.observable('modal' + data.ImageID);
    self.modal_target = ko.observable('#modal' + data.ImageID);
    self.show_modal = ko.observable(false);
    self.fullname = ko.observable(data.Filename + "." + data.Extension);
    self.image_id = ko.computed(function () {
        return 'img' + data.ImageID;
    });
    self.with_comments = ko.computed(function () {
        return ko.unwrap(parent.with_comments());
    });
    self.delete_image = function (img) {
        var img_filename = ko.unwrap(img.filename()) + '.' + ko.unwrap(img.extension());
        var delete_url = parent.delete_api(img_filename);
        $.ajax({
            url: delete_url,
            method: 'DELETE',
            success: function (data, status, xhr) {
                
                var images = ko.unwrap(parent.images()).filter(function (i) {
                    return i != img;
                });

                // update the images by removing the image
                parent.images(images);
            }
        });
    };
}

function PostViewModel(data) {
    var self = this;
    self.postedOn = ko.observable(data.PostedOn);
    self.comment = ko.observable(data.Comment);
    self.postId = ko.observable(data.ID);
    self.author = ko.observable(new UserViewModel(data.Author));
}

function UserViewModel(data) {
    var self = this;
    self.user_id = ko.observable(data.ID);
    self.username = ko.observable(data.Username);
    self.firstname = ko.observable(data.FirstName);
    self.lastname = ko.observable(data.LastName);
    self.email = ko.observable(data.Email);
    self.profile_image = ko.observable(data.ProfileImageUrl);
}

var numberOfComments = function (data) {
    if (!$.isEmptyObject(data)) {
        return data.length;
    }

    return 0;
}

 ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        $(element).modal({
            show: false
        });
        
        var value = valueAccessor();
        if (typeof value === 'function') {
            $(element).on('hide.bs.modal', function() {
               value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
           $(element).modal("destroy");
        });
        
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
}
