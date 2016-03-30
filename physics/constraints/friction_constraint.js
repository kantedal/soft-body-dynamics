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
        this._connectionPoint = this._pointMass.currentPos.clone();
    }
    FrictionConstraint.prototype.solve = function () {
        if (this._pointMass.isColliding) {
            var pointPoistion = this._pointMass.currentPos.clone();
            pointPoistion.setY(0);
            var delta = pointPoistion.clone().sub(this._connectionPoint);
            delta.normalize();
            var length = pointPoistion.distanceTo(this._connectionPoint);
            var offset = delta.multiplyScalar(length);
            if (length > this._breakingDistance)
                this.shouldRemove = true;
            console.log(offset);
            this._pointMass.currentPos.add(offset.clone().multiplyScalar(0.5));
        }
    };
    return FrictionConstraint;
})();
//# sourceMappingURL=friction_constraint.js.map