define(['services/logger'], function (logger) {
    var title = 'Home';
    var vm = {
        activate: activate,
        title: title,
        attached: attached,
        newsitems: ko.observableArray(),
        manager: new breeze.EntityManager('breeze/breeze'),
        GetPicture: GetPicture
    };
    function GetPicture(element, index, data) {
        $(".pictures", element).loremImages(200, 200, {
            count: 1,
            grey: 0,

            itemBuilder: function (i, url) {
                return '<li><a href="http://lorempixel.com" class="thumbnail"><img src="' + url + '"></a></li>';
            }
        });

    }
    


    return vm;
    function attached(view) {
        
        var manager = vm.manager;
        manager.executeQuery(breeze.EntityQuery.from("Newsfeeds").orderBy("DateAdded"))
                    .then(
                    function (data) {
                        
                        vm.newsitems(data.results);
                    });

    }
    //#region Internal Methods
    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
   
    //#endregion
});