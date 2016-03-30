/**
 * Created by filles-dator on 2016-03-30.
 */
///<reference path="./point_mass.ts"/>
var Integration = (function () {
    function Integration(method) {
        this._method = method;
    }
    Integration.prototype.update = function (point, time, delta) {
        switch (this._method) {
            case Integration.VERLET:
                this.verlet(point, time, delta);
                break;
            case Integration.RUNGE_KUTTA_4:
                break;
            case Integration.EULER:
                this.euler(point, time, delta);
                break;
            default:
                break;
        }
    };
    Integration.prototype.verlet = function (point, time, delta) {
        point.velocity = point.currentPos.clone().sub(point.lastPos);
        point.lastPos = point.currentPos.clone();
        point.currentPos = point.currentPos.clone().add(point.velocity.clone().multiplyScalar(1.0 - 0.0)).add(point.acceleration.multiplyScalar(delta * delta));
    };
    Integration.prototype.euler = function (point, time, delta) {
        point.velocity.add(point.acceleration.clone().multiplyScalar(delta));
        point.currentPos.add(point.velocity.clone().multiplyScalar(delta));
    };
    Object.defineProperty(Integration.prototype, "method", {
        get: function () {
            return this._method;
        },
        set: function (value) {
            this._method = value;
        },
        enumerable: true,
        configurable: true
    });
    Integration.VERLET = 0;
    Integration.RUNGE_KUTTA_4 = 1;
    Integration.EULER = 2;
    return Integration;
})();
//# sourceMappingURL=integration.js.map