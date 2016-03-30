/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./../threejs/three.d.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>

class PointMass {
    private _currentPos: THREE.Vector3;
    private _lastPos: THREE.Vector3;
    private _velocity: THREE.Vector3;
    private _acceleration: THREE.Vector3;

    private _constraintForce: THREE.Vector3;
    private _mass: number;
    private _vertexIndices: number[];
    private _vertexOffset: THREE.Vector3[];
    private _isAttatchment: boolean;
    private _isColliding: boolean;

    constructor(position: THREE.Vector3, mass: number){
        this._currentPos = position.clone();
        this._lastPos = position.clone();
        this._mass = mass;
        this._constraintForce = new THREE.Vector3(0,0,0);
        this._isAttatchment = false;
        this._isColliding = false;
        this._vertexIndices = [];
        this._vertexOffset = [];
    }

    public attatchVertex(index: number, offset: THREE.Vector3){
        this._vertexIndices.push(index);
    }

    get lastPos():THREE.Vector3 {
        return this._lastPos;
    }

    set lastPos(value:THREE.Vector3) {
        this._lastPos = value;
    }

    get currentPos():THREE.Vector3 {
        return this._currentPos;
    }

    set currentPos(value:THREE.Vector3) {
        this._currentPos = value;
    }

    get mass():number {
        return this._mass;
    }

    get isAttatchment():boolean {
        return this._isAttatchment;
    }

    set isAttatchment(value:boolean) {
        this._isAttatchment = value;
    }

    get constraintForce():THREE.Vector3 {
        return this._constraintForce;
    }

    set constraintForce(value:THREE.Vector3) {
        this._constraintForce = value;
    }

    get vertexIndices():number[] {
        return this._vertexIndices;
    }

    get vertexOffset():THREE.Vector3[] {
        return this._vertexOffset;
    }

    get velocity():THREE.Vector3 {
        return this._velocity;
    }

    set velocity(value:THREE.Vector3) {
        this._velocity = value;
    }

    get acceleration():THREE.Vector3 {
        return this._acceleration;
    }

    set acceleration(value:THREE.Vector3) {
        this._acceleration = value;
    }

    get isColliding():boolean {
        return this._isColliding;
    }

    set isColliding(value:boolean) {
        this._isColliding = value;
    }
}