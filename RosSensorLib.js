(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * If you use roslib in a browser, all the classes will be exported to a global variable called SENSORLIB.
 *
 * If you use nodejs, this is the variable you get when you require('roslib')
 */
var SENSORLIB = this.SENSORLIB || {
    REVISION: '0.0.1'
};

// Add sensors components
Object.assign(SENSORLIB, require('./sensors'));

global.SENSORLIB = SENSORLIB;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./sensors":4}],2:[function(require,module,exports){
class SensorPublisher {
    constructor(topic, sensor) {
        this.topic = topic;
        this.sensor = sensor;

        // setup sensor
        try {
            this.sensor.addEventListener('reading', this.onReading);
            this.sensor.addEventListener('error', this.onError);
            this.sensor.start();
        } catch (error) {
            // Handle construction errors.
            if (error.name === 'SecurityError') {
                // See the note above about feature policy.
                alert('Accelerometer Sensor construction was blocked by a feature policy.');
            } else if (error.name === 'ReferenceError') {
                alert('Accelerometer Sensor is not supported by the User Agent.');
            } else {
                throw error;
            }
        }
    }

    onError(event) {
        throw 'onError method not defined!';
    }

    onReading(event) {
        throw 'onReading method not defined!';
    }
}

module.exports = SensorPublisher;
},{}],3:[function(require,module,exports){
const SensorPublisher = require('./SensorPublisher.js');

class TestSensor extends SensorPublisher {
    constructor(topic, test) {
        let sensor;

        try {
            sensor = new Accelerometer({frequency: 10});
        } catch(error) {
            if (error.name === 'ReferenceError') {
                alert('Accelerometer Sensor is not supported by the User Agent.');
            } else {
                throw error;
            }
        }

        super(topic, sensor);

        this.test = test;
    }

    onError(event) {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            navigator.permissions.query({ name: 'accelerometer' })
                .then(result => {
                  if (result.state === 'denied') {
                    alert('Permission to use accelerometer sensor is denied.');
                    return;
                  }
                  // Use the sensor.
                });
        } else if (event.error.name === 'NotReadableError' ) {
            alert('Cannot connect to the Accelerometer.');
        }
    }

    onReading(event) {
        if (Math.abs(event.x) < 0.6) {
            return;
        }

        document.getElementById('acc-info').innerHTML = `Accelerometer :<br>x: ${event.x}<br>
        y: ${event.x}<br>
        z: ${event.z}`;
    }

}

module.exports = TestSensor;
},{"./SensorPublisher.js":2}],4:[function(require,module,exports){
/**
 * This file tells @function require what to import when requiring the entire sensors folder.
 * 
 * Any module to be exported to the library should have an entry in the object below.
 */
module.exports = {
    TestSensor: require('./TestSensor')
};
},{"./TestSensor":3}]},{},[1]);
