function UserImagesViewModel() {
    var self = this;

    // Data
    self.images = ko.observableArray([]);
    var thumbnail = ko.observable();

    // Functions
    $.getJSON(url_path, function (allData) {
        var image = $.map(allData, function (item) {
            return new ImageViewModel(item);
        });
        self.images(image);
    });
}

function ImageViewModel(data) {
    var self = this;
    this.thumbnailUrl = ko.observable(data.PathThumbnailUrl);
    this.originalUrl = ko.observable(data.PathOriginalUrl);
    if (!$.isEmptyObject(data.Comments)) {
        this.comments = data.Comments.length;
    }
    else {
        this.comments = 0;
    }
}