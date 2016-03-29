/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./constraint.ts"/>
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
var HeightCollisionConstraint = (function () {
    function HeightCollisionConstraint(collisionHeight, collisionPoint) {
        this._collisionHeight = collisionHeight;
        this._collisionPoint = collisionPoint;
    }
    HeightCollisionConstraint.prototype.solve = function () {
        if (this._collisionPoint.currentPos.y <= this._collisionHeight) {
            var distance = this._collisionPoint.currentPos.y - this._collisionHeight;
            this._collisionPoint.currentPos.y += -distance * 0.5;
        }
    };
    return HeightCollisionConstraint;
})();
//# sourceMappingURL=height_collision_constraint.js.map