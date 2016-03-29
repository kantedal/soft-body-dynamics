/**
 * Created by filles-dator on 2016-03-28.
 */

///<reference path="./constraint.ts"/>
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>

class HeightCollisionConstraint implements Constraint {
    private _collisionHeight: number;
    private _collisionPoint: PointMass;

    constructor(collisionHeight: number, collisionPoint: PointMass){
        this._collisionHeight = collisionHeight;
        this._collisionPoint = collisionPoint;
    }

    public solve():void {
        if(this._collisionPoint.currentPos.y <= this._collisionHeight) {
            var distance = this._collisionPoint.currentPos.y - this._collisionHeight;
            this._collisionPoint.currentPos.y += -distance * 0.5;
        }
    }
}