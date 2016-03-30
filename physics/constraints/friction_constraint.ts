/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>
///<reference path="./constraint.ts"/>

class FrictionConstraint implements Constraint {
    shouldRemove:boolean = false;

    private _breakingDistance: number = 0.3;
    private _restLength: number = 0.0;

    private _pointMass: PointMass;
    private _connectionPoint: THREE.Vector3;
    private _normal: THREE.Vector3;

    constructor(pointMass: PointMass){
        this._pointMass = pointMass;
        this._connectionPoint = this._pointMass.currentPos.clone();
    }


    public solve() {
        if(this._pointMass.isColliding) {
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
    }

}