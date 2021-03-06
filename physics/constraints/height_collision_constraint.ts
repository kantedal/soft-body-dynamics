/**
 * Created by filles-dator on 2016-03-28.
 */

///<reference path="./constraint.ts"/>
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>

class HeightCollisionConstraint implements Constraint {
    shouldRemove:boolean = false;

    private _collisionHeight: number;
    private _collisionPoint: PointMass;

    constructor(collisionHeight: number, collisionPoint: PointMass){
        this._collisionHeight = collisionHeight;
        this._collisionPoint = collisionPoint;
    }

    public solve():void {
        if(this._collisionPoint.position.y <= this._collisionHeight) {
            var distance = this._collisionPoint.position.y - this._collisionHeight;
            this._collisionPoint.position.y += -distance * 0.5;
            this._collisionPoint.isColliding = true;
        }
        else
            this._collisionPoint.isColliding = false;
    }
}