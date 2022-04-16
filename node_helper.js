/* Magic Mirror
 * Module: MMM-KVV
 *
 * By yo-less
 * MIT Licensed.
 */

const request = require('request');
const NodeHelper = require("node_helper");



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

	
	/* getParams
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params. https://www.delijn.be/rise-api-core/haltes/vertrekken/
	 * Link format: https://api.delijn.be/DLKernOpenData/v1/beta/haltes/{entiteitnummer}/{haltenummer}/real-time
	 */
	
	getParams: function() {
		var params = this.config.maxConn;
        params += "/";
        params += this.config.halteNummer;
        return params;
	},
	
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
            this.config = payload;
            var kvv_url = this.config.apiBase + this.getParams() + "/real-time";
            console.log("De link is: " + kvv_url);
			this.getData(kvv_url, this.config.halteNummer);
        }
    },

    getData: function(options, halteNummer) {
		request(options, (error, response, body) => {
	        if (response.statusCode === 200) {
				this.sendSocketNotification("TRAMS" + halteNummer, JSON.parse(body));
				} else {
                console.log("Error getting tram connections " + response.statusCode);
            }
        });
    }
});