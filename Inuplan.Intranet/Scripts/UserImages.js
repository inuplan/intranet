function appViewModel(api_url) {
    var self = this;
    self.api = api_url;
    self.vm = new UserImagesViewModel(self);
}

function UserImagesViewModel(parent) {
    var self = this;

    // Data
    self.images = ko.observableArray([]);
    self.withComments = ko.observable(true);
    var data = { comments: ko.unwrap(self.withComments()) };

    // Functions
    $.getJSON(parent.api, data, function (allData) {
        var images = $.map(allData, function (item) {
            return new ImageViewModel(item);
        });
        self.images(images);
    });
}

function ImageViewModel(data) {
    var self = this;
    self.thumbnailUrl = ko.observable(data.PathThumbnailUrl);
    self.originalUrl = ko.observable(data.PathOriginalUrl);
    self.previewUrl = ko.observable(data.PathPreviewUrl);
    self.numberOfComments = ko.observable(numberOfComments(data.Comments));
    self.filename = ko.observable(data.Filename);
    self.extension = ko.observable(data.Extension);
    self.imageId = ko.observable(data.ImageID);
    self.modalId = ko.observable('modal' + data.ImageID);
    self.modalTarget = ko.observable('#modal' + data.ImageID);
    self.showModal = ko.observable(false);
    self.fullname = ko.observable(data.Filename + "." + data.Extension);
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
    self.userId = ko.observable(data.ID);
    self.username = ko.observable(data.Username);
    self.firstname = ko.observable(data.FirstName);
    self.lastname = ko.observable(data.LastName);
    self.email = ko.observable(data.Email);
    self.profileImage = ko.observable(data.ProfileImageUrl);
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