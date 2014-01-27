define(['durandal/system', 'plugins/router', 'services/logger'],
    function (system, router, logger) {
        var shell = {
            activate: activate,
            router: router,
            token: token,
            logoff:logoff

        };
        
        return shell;
        function token() {
            return $("input[name='__RequestVerificationToken']").val();
        }

        //#region Internal Methods
        function activate() {
            return boot();
        }
        function logoff() {
           
            var token = $("input[name='__RequestVerificationToken']").val();

            $.ajax({
                url: "/Account/LogOff",
                cache: false,
                type: "POST",
                async: false,
                data: { "__RequestVerificationToken": token },
                success: function (data) {
                    log("from success in logoff", data, false); //this shows up in the log

                    location.reload();
                    
                },
                error: function (data) {
                    return false;
                }

            });
        }
        function boot() {
            log('Hot Towel SPA Loaded!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                { route: '', moduleId: 'home', title: 'Home', nav: 1 },
                { route: 'details', moduleId: 'details', title: 'Details', nav: 2 }];

            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), false);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });