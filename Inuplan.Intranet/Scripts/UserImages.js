function appViewModel(api_url) {
    var self = this;
    self.api = api_url;
    self.vm = new UserImagesViewModel(self);
}

function UserImagesViewModel(parent) {
    var self = this;

    // Data
    self.images = ko.observableArray([]);
    self.with_comments = ko.observable(true);
    var data = { comments: ko.unwrap(self.with_comments()) };

    // Functions
    $.getJSON(parent.api, data, function (allData) {
        var images = $.map(allData, function (item) {
            return new ImageViewModel(item, self);
        });
        self.images(images);
    });
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