function AppViewModel(url, skip, take) {
    var self = this;

    self.current_page = ko.observable(0);
    self.total_pages = ko.observableArray([]);
    self.users = ko.observableArray([]);

    $.ajax(url, {
        type: 'GET',
        dataType: 'json',
        data: {
            skip: skip,
            take: take
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result, status, jqXhr) {
            var dto = result.Item;
            var user_arr = $.map(dto.CurrentItems, function (user_obj) {
                return new UserViewModel(user_obj);
            });
            self.users(user_arr);
            var pages = new Array();
            for (var i = 1; i <= dto.CurrentPage; i++) {
                pages.push(i);
            }
            self.current_page(dto.CurrentPage);
            self.total_pages(pages);
        },
    });
}

function UserViewModel(data) {
    var self = this;
    self.id = ko.observable(data.ID);
    self.username = ko.observable(data.Username);
    self.firstname = ko.observable(data.FirstName);
    self.lastname = ko.observable(data.LastName);
    self.email = ko.observable(data.Email);
    self.roles = ko.observableArray([]);
    var roles_arr = $.map(data.Roles, function (item) {
        return new RoleViewModel(item);
    });
    self.roles(roles_arr);
}

function RoleViewModel(data) {
    var self = this;
    self.id = ko.observable(data.ID);
    self.name = ko.observable(data.Name);
}