/* Magic Mirror
 * Module: MMM-KVV
 *
 * By yo-less
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const request = require('request');
const Log = require("logger");



module.exports = NodeHelper.create({

    start: function() {
        Log.log("Starting node helper for: " + this.name);
    },


	/* getParams
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params. https://www.delijn.be/rise-api-core/haltes/vertrekken/ OLD API -- NO INFO
	 * Link format: https://api.delijn.be/DLKernOpenData/v1/beta/haltes/{entiteitnummer}/{haltenummer}/real-time NEW API -- key: 843e057454fe43c2b6800ada37ae4bb4
	 */

	getParams: function() {
		var params = this.config.maxConn;
        params += "/";
        params += this.config.halteNummer;
        return params;
	},

    socketNotificationReceived: function(notification, payload) {
        Log.log(notification);

        if(notification === 'CONFIG'){
            this.config = payload;
            var kvv_url = this.config.apiBase + this.getParams() + "/real-time";
            const options = {
                url: kvv_url,
                headers: {
                    'Ocp-Apim-Subscription-Key': '843e057454fe43c2b6800ada37ae4bb4'
                }
            };
			this.getData(options, this.config.halteNummer);
        }
    },

    getData: function(options, halteNummer) {
        let _this = this;
		request(options, (error, response, body) => {
	        if (response.statusCode === 200) {
                Log.log("thonk");
				_this.sendSocketNotification("TRAMS" + halteNummer, JSON.parse(body));
            } else {
                Log.log("Error getting tram connections " + response.statusCode);
            }
        });
    }
});
