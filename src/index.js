"use strict";
exports.__esModule = true;
exports.Client = void 0;
var http = require("request");
var lodash_1 = require("lodash");
http.defaults({
    encoding: 'utf-8',
    json: true
});
var Client = /** @class */ (function () {
    function Client(options) {
        this.api = new API(options);
    }
    /**
     * Lists the accounts that you have now
     * @returns {Promise<any>}
     */
    Client.prototype.listAccounts = function () {
        return this.api.get('listaccts');
    };
    /**
     * List IP addresses available
     * @returns {Promise<any>}
     */
    Client.prototype.listIPAddresses = function () {
        return this.api.get('listips');
    };
    /**
     * Create an account
     * @returns {Promise<any>}
     */
    Client.prototype.createAccount = function (options) {
        return this.api.get('createacct', options);
    };
    Client.prototype.terminateAccount = function (user) {
        var params = {
            user: user
        };
        return this.api.get('removeacct', params);
    };
    return Client;
}());
exports.Client = Client;
var API = /** @class */ (function () {
    function API(options) {
        this.options = options;
        this.defaultOptions = {
            apiType: 'json-api',
            version: 1
        };
        (0, lodash_1.merge)(this.options, this.defaultOptions);
    }
    API.prototype.get = function (action, query) {
        if (query && typeof query != 'string')
            query = Utils.objectToQs(query);
        var requestOptions = {
            url: this.options.serverUrl + '/' + this.options.apiType + '/' + action + '?api.version=' + this.options.version + '&' + query,
            headers: {
                Authorization: 'WHM ' + this.options.username + ':' + this.options.remoteAccessKey
            }
        };
        console.log(requestOptions);
        return new Promise(function (resolve, reject) {
            http.get(requestOptions, function (err, res, body) {
                if (err) {
                    console.error('Error');
                    reject({ error: err });
                }
                else if (!res.metadata) {
                    reject({ error: res.metadata.reason });
                }
                else
                    resolve(res);
            });
        });
    };
    return API;
}());
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.qsToObject = function (querystring) {
        var object = {};
        var splitQs = querystring.split('&');
        splitQs.forEach(function (item) {
            item = item.split('=');
            object[item[0]] = item[1];
        });
        return object;
    };
    Utils.objectToQs = function (object) {
        var qs = '';
        for (var prop in object) {
            if (qs.length > 0)
                qs += '&';
            qs += encodeURIComponent(prop) + '=' + encodeURIComponent(object[prop]);
        }
        console.log(object);
        console.log(qs);
        return qs;
    };
    return Utils;
}());
