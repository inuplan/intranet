function UserImagesViewModel(username) {
    var self = this;
    var url = "/api/" + username + "/image";

    // Data
    self.images = ko.observableArray([]);

    $.getJSON(url, function (allData) {
        console.log(allData);
    });
}