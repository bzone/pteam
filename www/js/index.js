/*jshint quotmark: false */
/*global nfc, ndef, toast, alert, cordova, checkbox, statusDiv, sample */

"use strict";

var android = (cordova.platformId === 'android'),
    windowsphone = (cordova.platformId === 'windowsphone'),
    bb10 = (cordova.platformId === 'blackberry10'),
    sampleData;

var app = {
    sampleDataIndex: 0,
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', app.deviceready, false);
    },
    deviceready: function () {
        document.getElementById('checkbox').addEventListener('change', app.toggleCheckbox, false);
        sample.addEventListener('click', app.showSampleData, false);
    },
    shareMessage: function () {
        var mimeType = 'text/pg';
        var  payload =  'Hello Bzone';
        var record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));
		
        nfc.share(
            [record],
            function () {
                if (bb10) {
                    // Blackberry calls success as soon as the Card appears
                    checkbox.checked = false;
                    app.enableUI();
                } else if (windowsphone) {
                    // Windows phone calls success immediately. Bug?
                    app.notifyUser("Sharing Message");
                } else {
                    // Android call the success callback when the message is sent to peer
                    navigator.notification.vibrate(100);
                    app.notifyUser("Sent Message to Peer");
                }
            }, function (reason) {
                alert("Failed to share tag " + reason);
                checkbox.checked = false;
                app.enableUI();
            }
        );
    },
	
	
	
    unshareMessage: function () {
  
        nfc.unshare(
            function () {
                navigator.notification.vibrate(100);
                app.notifyUser("Message is no longer shared.");
            }, function (reason) {
                alert("Failed to unshare message " + reason);
            }
        );
    },
    notifyUser: function (message) {
        if (android) {
            toast.showShort(message);
        } else {
            statusDiv.innerHTML = message;
            setTimeout(function() {
                statusDiv.innerHTML = "";
            }, 3000);
        }
    },
    toggleCheckbox: function (e) {
        if (e.target.checked) {
            app.shareMessage();
        } else {
            app.unshareMessage();
        }
    }
};

