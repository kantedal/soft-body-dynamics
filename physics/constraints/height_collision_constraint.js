/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./constraint.ts"/>
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
var HeightCollisionConstraint = (function () {
    function HeightCollisionConstraint(collisionHeight, collisionPoint) {
        this.shouldRemove = false;
        this._collisionHeight = collisionHeight;
        this._collisionPoint = collisionPoint;
    }
    HeightCollisionConstraint.prototype.solve = function () {
        if (this._collisionPoint.position.y <= this._collisionHeight) {
            var distance = this._collisionPoint.position.y - this._collisionHeight;
            this._collisionPoint.position.y += -distance * 0.5;
            this._collisionPoint.isColliding = true;
        }
        else
            this._collisionPoint.isColliding = false;
    };
    return HeightCollisionConstraint;
})();
//# sourceMappingURL=height_collision_constraint.js.map