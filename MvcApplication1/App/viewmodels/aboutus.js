define(['services/logger'], function (logger) {
    var title = 'About Us';
    var vm = {
        activate: activate,
        title: title,
        attached:attached
    };

    return vm;

    //#region Internal Methods
    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    function attached(view) {
        $(".pictures",view).css("width","100%").loremImages(800,300, {
            count: 1,
            grey: 0,

            itemBuilder: function (i, url) {
                return '<li><a href="http://lorempixel.com" class="thumbnail"><img src="' + url + '"></a></li>';
            }
        });
    }
    //#endregion
});