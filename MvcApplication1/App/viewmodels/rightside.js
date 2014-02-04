define(['services/logger'], function (logger) {
    var title = 'Home';
    var vm = {
        activate: activate,
        title: title,
        attached: attached
    };

    return vm;
    function attached(view) {
        //$(".pictures").loremImages(200, 200, {
        //    count: 3,
        //    grey: 0,

        //    itemBuilder: function (i, url) {
        //        return '<li><a href="http://lorempixel.com" class="thumbnail"><img src="' + url + '"></a></li>';
        //    }
        //});
    }
    //#region Internal Methods
    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //#endregion
});