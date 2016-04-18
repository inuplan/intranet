function AppViewModel(api) {
    var self = this;
    self.vm = new UserImagesViewModel(api);
}

function UserImagesViewModel(api) {
    var self = this;
    self.images = ko.observableArray([]);

    // Functions
    $.ajax(api, {
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (result, status, jqXhr) {
            var images = $.map(result.Item, function (item) {
                return new ImageViewModel(item);
            });
            self.images(images);
        },
        error: error_handler
    })
}

function ImageViewModel(data) {
    var self = this;

    self.image_id = ko.observable(data.ImageID);
    self.original_url = ko.observable(data.PathOriginalUrl);
    self.preview_url = ko.observable(data.PathPreviewUrl);
    self.thumbnail_url = ko.observable(data.PathThumbnailUrl);
    self.filename = ko.observable(data.Filename);
    self.extension = ko.observable(data.Extension);
    self.show_modal = ko.observable(false);

    // Computed observables
    self.fullname = ko.computed(function () {
        return data.Filename + "." + data.Extension;
    })
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

var error_handler = function (jqXhr, status, errorThrown) {
    $('#error_container').show();
    var msg = jqXhr.status + " - " + errorThrown;
    $('#error_message').text(msg);
}