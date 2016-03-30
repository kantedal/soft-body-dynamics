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
        this._connectionPoint = this._pointMass.position.clone();
    }


    public solve() {
        if(this._pointMass.isColliding) {
            this._pointMass.velocity.setX(this._pointMass.velocity.x * 0.7);
            this._pointMass.velocity.setZ(this._pointMass.velocity.z * 0.7);
        }
    }

}