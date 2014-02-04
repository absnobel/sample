define(['durandal/system', 'services/logger'],
    function (system, logger) {
        
        var nulloDate = new Date(1900, 0, 1);
        var referenceCheckValidator;
        var Validator = breeze.Validator;

      
        var entityNames = {
            Newsfeed: 'Newsfeed'
            //,
            //session: 'Session',
            //room: 'Room',
            //track: 'Track',
            //timeslot: 'TimeSlot'
        };

        var model = {
            //applySessionValidators: applySessionValidators,
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames,
            //orderBy: orderBy
        };

        return model;

        //#region Internal Methods
        function configureMetadataStore(metadataStore) {
            metadataStore.registerEntityTypeCtor(
                'Newsfeed', function () { this.isPartial = false }, NewsfeedInitializer);

            // referenceCheckValidator = createReferenceCheckValidator();
            // Validator.register(referenceCheckValidator);
            //log('Validators registered');
        }

        function createReferenceCheckValidator() {
            var name = 'realReferenceObject';
            var ctx = { messageTemplate: 'Missing %displayName%' };
            var val = new Validator(name, valFunction, ctx);
            log('Validators created');
            return val;

            function valFunction(value, context) {
                return value ? value.id() !== 0 : true;
            }
        }

        //function applySessionValidators(metadataStore) {
        //    var types = ['contactme'];
        //    types.forEach(addValidator);
        //    log('Validators applied', types);

        //    function addValidator(propertyName) {
        //        var sessionType = metadataStore.getEntityType('Session');
        //        sessionType.getProperty(propertyName)
        //            .validators.push(referenceCheckValidator);
        //    }
        //}

        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.track);
            createNullo(entityNames.speaker, { firstName: ' [Select a person]' });

            function createNullo(entityName, values) {
                var initialValues = values
                    || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }

        }

        function NewsfeedInitializer(newsfeeditem) {
            //session.tagsFormatted = ko.computed({
            //    read: function () {
            //        var text = session.tags();
            //        return text ? text.replace(/\|/g, ', ') : text;
            //    },
            //    write: function (value) {
            //        session.tags(value.replace(/\, /g, '|'));
            //    }
            //});

            //newsfeeditem.phonenumber.extend({
            //    pattern: {
            //        message: 'Not Valid (ex 4165551212)',
            //        params: '1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?'
            //    }
            //});
            //contact.contactname.extend({
            //    required: true
            //});
            //contact.email.extend({
            //    email: true

            //});
            //contact.tmessage.extend({
            //    required: true
            //});
            //contact.urgency = ko.observable();
        }

        function personInitializer(person) {
            person.fullName = ko.computed(function () {
                var fn = person.firstName();
                var ln = person.lastName();
                return ln ? fn + ' ' + ln : fn;
            });
            person.imageName = ko.computed(function () {
                return makeImageName(person.imageSource());
            });
        }



        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(model), showToast);
        }
        //#endregion
    });