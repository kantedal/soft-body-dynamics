/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
///<reference path="./constraint.ts"/>
var FrictionConstraint = (function () {
    function FrictionConstraint(pointMass) {
        this.shouldRemove = false;
        this._breakingDistance = 0.3;
        this._restLength = 0.0;
        this._pointMass = pointMass;
        this._connectionPoint = this._pointMass.position.clone();
    }
    FrictionConstraint.prototype.solve = function () {
        if (this._pointMass.isColliding) {
            this._pointMass.velocity.setX(this._pointMass.velocity.x * 0.9);
            this._pointMass.velocity.setZ(this._pointMass.velocity.z * 0.9);
        }
    };
    return FrictionConstraint;
})();
//# sourceMappingURL=friction_constraint.js.map