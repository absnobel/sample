define([
    'durandal/system',
    'services/model',
    'config',
    'services/logger',
   ],
    function (system, model,config, logger) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var readyDeferred = Q.defer(), whenReady = readyDeferred.promise;

        var entityNames = model.entityNames;

        var cancelChanges = function () {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };

        //var primeData = function () {
        //    var promise = Q.all([
        //        getLookups(),
        //        getSpeakerPartials(null, true)])
        //        .then(applyValidators);

        //    return promise.then(success);

        //    function success() {
        //        datacontext.lookups = {
        //            rooms: getLocal('Rooms', 'name', true),
        //            tracks: getLocal('Tracks', 'name', true),
        //            timeslots: getLocal('TimeSlots', 'start', true),
        //            speakers: getLocal('Persons', orderBy.speaker, true)
        //        };
        //        log('Primed data', datacontext.lookups);
        //    }

        //    function applyValidators() {
        //        model.applySessionValidators(manager.metadataStore);
        //    }

        //};

        //
        var createContact = function () {
            //fetch metadata if needed 
           return manager.createEntity(entityNames.contact); 
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        var datacontext = {
            createContact: createContact,
            hasChanges: hasChanges,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges,
            whenReady:whenReady
        };
        initializeDatacontext();
        return datacontext;
        function initializeDatacontext() {
            manager.fetchMetadata(config.remoteServiceName)
                   .then(function () {
                       readyDeferred.resolve();
                       // do success stuff;
                   })
                   .fail(function (error) {
                       readyDeferred.reject(error);
                       // do error stuff;
                   });
        }

        //#region Internal methods        

        function getLocal(resource, ordering, includeNullos) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }

        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }

        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function (entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .then(processLookups)
                .fail(queryFailed);
        }

        function processLookups() {
            model.createNullos(manager);
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion
    });