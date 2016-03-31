/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./../threejs/three.d.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
var PointMass = (function () {
    function PointMass(position, mass) {
        this._nextPosition = position.clone();
        this._position = position.clone();
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._mass = mass;
        this._constraintForce = new THREE.Vector3(0, 0, 0);
        this._isAttatchment = false;
        this._isColliding = false;
        this._vertexIndices = [];
        this._vertexOffset = [];
    }
    PointMass.prototype.attatchVertex = function (index, offset) {
        this._vertexIndices.push(index);
    };
    Object.defineProperty(PointMass.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "nextPosition", {
        get: function () {
            return this._nextPosition;
        },
        set: function (value) {
            this._nextPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "mass", {
        get: function () {
            return this._mass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "isAttatchment", {
        get: function () {
            return this._isAttatchment;
        },
        set: function (value) {
            this._isAttatchment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "constraintForce", {
        get: function () {
            return this._constraintForce;
        },
        set: function (value) {
            this._constraintForce = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "vertexIndices", {
        get: function () {
            return this._vertexIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "vertexOffset", {
        get: function () {
            return this._vertexOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "velocity", {
        get: function () {
            return this._velocity;
        },
        set: function (value) {
            this._velocity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "acceleration", {
        get: function () {
            return this._acceleration;
        },
        set: function (value) {
            this._acceleration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "isColliding", {
        get: function () {
            return this._isColliding;
        },
        set: function (value) {
            this._isColliding = value;
        },
        enumerable: true,
        configurable: true
    });
    return PointMass;
})();
//# sourceMappingURL=point_mass.js.map