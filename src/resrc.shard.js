(function (resrc, window) {
    "use strict";

    /**
     * Will be set to TRUE if localStorage is supported in this browser
     *
     * @type {Boolean}
     */
    var local_storage_supported = (function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    })();


    /**
     * Generates a localStorage key for a URL
     *
     * @param url {String}  URL to generate key for
     * @returns   {String}
     */
    var getLocalStorageKey = function(url){
        return 'resrc.it::'+url;
    };


    /**
     * Checks for a server value stored in localStorage for a URL
     *
     * @param url  {String}  The URL to check for
     * @returns {String|false}  Returns string value if found in localStorage
     *                          or FALSE otherwise
     */
    var hasStoredServerForUrl = function(url){
        var key = getLocalStorageKey(url);
        if(local_storage_supported && localStorage[key] !== null){
            return localStorage[key];
        }
        return false;
    };


    /**
     * Stores a server name against a URL in local storage (if supported)
     *
     * @param url     {String}  URL to store server for
     * @param server  {String}  Server to store
     */
    var storeServerForUrl = function(url,server){
        var key = getLocalStorageKey(url);
        if(local_storage_supported){
            localStorage[key] = server;
        }
    };


    /**
     * Pull a random(ish) server from the stack
     *
     * @param i {Number}  An index number
     * @param resrcServerArray {Array<String>}  Array of servers to pick from
     * @returns {String}
     */
    var serverShard = function (i, resrcServerArray) {
        return resrcServerArray[i % resrcServerArray.length];
    };


    /**
     * Extract host/domain from a URL
     *
     * @param url {String} URL to extract hostname from
     * @returns {String}
     */
    var getDomainName = function (url) {
        var a = document.createElement("a");
        a.href = url;
        return a.hostname;
    };


    /**
     * Modifies a URL to set a new host/domain name
     *
     * @param url       {String}  The URL to modify
     * @param newDomain {String} The new host/domain name to set
     * @returns {String}
     */
    var setDomainName = function(url,newDomain){
        return url.replace(getDomainName(url),newDomain);
    };


    /**
     * The Resrc.it Shard Plugin
     *
     * @param options
     * @returns resrc
     */
    resrc.shard = function (options) {

        var defaults = {
            attribute: "data-src",
            images: resrc.getElementsByClassName(resrc.options.resrcClass),
            servers: ["app1.resrc.it", "app2.resrc.it", "app3.resrc.it", "app4.resrc.it"],
            localStorage: true
        };

        var settings = resrc.extend(defaults, options),
            counter = 0,
            use_local_storage = local_storage_supported && !!settings.localStorage;



        /**
         * Returns an index to use for a specified URL.
         * Basing the index off a URL rather than just an iterator means that
         * the shard used *should* be the same on consecutive requests, improving
         * the cacheness
         *
         * @param url {String}  The URL to pick a shard for
         * @returns {String} Server to use for this image
         */
        var getServerIndexForUrl = function(url){

            ++ counter;
            var server;

            var storedServer = hasStoredServerForUrl(url);
            if(use_local_storage && storedServer !== false){
                // Check returned server is still in out servers list (expiry)
                if(settings.servers.indexOf(storedServer) > -1){
                    server = storedServer;
                }
            }

            if(!server){
                // Do it the old-fasioned way - trust to order of loading to match the right server
                server = serverShard(counter, settings.servers);
            }

            // Store for later (if enabled)
            if(use_local_storage){
                storeServerForUrl(url,server);
            }

            return server;
        };



        /*
         * Add an imageObject modifier to resrc to apply domain sharding to the image url
         */
        resrc.plugin.addImageObjectModifier(function (elem, resrcObj) {
            // Create a reference to the new server address.
            var server = getServerIndexForUrl(resrcObj.fallbackImgPath);

            // Replace the existing server domain name with the new "sharded" server domain.
            resrcObj.resrcImgPath = setDomainName(resrcObj.resrcImgPath, server);

            // Set the data-server attribute so that all subsequent requests come from the same server.
            elem.setAttribute("data-server", server);

            return resrcObj;
        });

        // Return resrc object to allow chaining
        return resrc;
    };

    return resrc;

}(resrc, window));
