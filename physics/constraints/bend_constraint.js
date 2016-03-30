/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
///<reference path="./constraint.ts"/>
var BendConstraint = (function () {
    function BendConstraint(restingDistance, stiffness, pointMassA, pointMassB, renderer) {
        this.shouldRemove = false;
        this._restingDistance = 1;
        this._tearingDistance = 2;
        this._renderer = renderer;
        this._restingDistance = restingDistance;
        this._stiffness = stiffness;
        this._pointMassA = pointMassA;
        this._pointMassB = pointMassB;
    }
    BendConstraint.prototype.solve = function () {
        var delta = this._pointMassB.position.clone().sub(this._pointMassA.position);
        delta.normalize();
        var length = this._pointMassA.position.distanceTo(this._pointMassB.position);
        var offset = delta.multiplyScalar(length - this._restingDistance);
        offset.multiplyScalar(this._stiffness);
        var multiplier = 0.5;
        if (!this._pointMassA.isAttatchment)
            this._pointMassA.position.add(offset.clone().multiplyScalar(multiplier));
        if (!this._pointMassB.isAttatchment)
            this._pointMassB.position.sub(offset.clone().multiplyScalar(multiplier));
    };
    Object.defineProperty(BendConstraint.prototype, "stiffness", {
        set: function (value) {
            this._stiffness = value;
        },
        enumerable: true,
        configurable: true
    });
    return BendConstraint;
})();
//# sourceMappingURL=bend_constraint.js.map