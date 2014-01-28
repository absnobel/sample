define(['durandal/system', 'plugins/router', 'services/logger'],
    function (system, router, logger) {
        var shell = {
            activate: activate,
            router: router,
            token: token,
            logoff:logoff,
            dataToggle : function (route) {
            return !!route.settings.subroutes ? 'dropdown' : '';
        },
        html :function (route) {
            return !!route.settings.subroutes ? route.name + ' <b class="caret"></b>' : route.name;
        },
        hash : function (route) {
            return !!route.settings.subroutes ? '#' : route.hash;
        },
        divider : function (route, parent) {
            system.log('Adding', route, 'to dropdown', 'Parent', parent);
            return route.hash === parent.hash;
        }
       
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

            var 
            sub1 = { route: 'details4/sub1', hash: '#details4/sub1', moduleId: 'details', name: 'Sub1' },
            sub2 = { route: 'details4/sub2', hash: '#details4/sub2', moduleId: 'details', name: 'Sub2' };
           
            var routes = [
                { route: '', moduleId: 'home', title: 'Home', nav: 1, settings: {} },
                { route: 'aboutus', moduleId: 'aboutus', title: 'About Us', nav: 2, settings: {} },
                { route: 'details2', moduleId: 'details', title: 'Women Talk', nav: 3, settings: {} },
                { route: 'details3', moduleId: 'details', title: 'Membership', nav: 4, settings: {} },
                { route: 'details4', moduleId: 'details', title: 'Downloads & DVDs', nav: 5, settings: { subroutes: [sub1, sub2] } },
                { route: 'details5', moduleId: 'details', title: 'Custom Videos', nav: 6, settings: {} },
                { route: 'details6', moduleId: 'details', title: 'Photo Sets', nav: 7, settings: {} },
                { route: 'details7', moduleId: 'details', title: 'UFWC Champions', nav: 8, settings: {} },
                { route: 'details8', moduleId: 'details', title: 'Copyright Info', nav: 9, settings: {} },
                { route: 'details9', moduleId: 'details', title: 'Privacy Policy', nav: 10, settings: {} },
                { route: 'details10', moduleId: 'details', title: 'Links', nav: 11, settings: {} },
                { route: 'details11', moduleId: 'details', title: 'Contact Us', nav: 12, settings: {} }
            ];

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