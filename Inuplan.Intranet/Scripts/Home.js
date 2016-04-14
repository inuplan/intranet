function AppViewModel(remote, skip, take) {
    var self = this;
    var url = userUrl(remote, skip, take);
    self.remote = remote;

    self.current_page = ko.observable(0);
    self.total_pages = ko.observable(0);
    self.users = ko.observableArray([]);

    $.ajax(url, {
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (result, status, jqXhr) {
            var user_arr = $.map(result.CurrentItems, function (user_obj) {
                return new UserViewModel(user_obj);
            });
            self.users(user_arr);
            self.current_page(result.CurrentPage);
            self.total_pages(result.TotalPages);
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

function userUrl(remote, skip, take) {
    return remote + "api/user?" + "skip=" + skip + "&take=" + take;
}