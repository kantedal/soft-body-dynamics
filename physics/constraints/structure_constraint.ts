/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./constraint.ts"/>
///<reference path="./../point_mass.ts"/>
///<reference path="./../../renderer.ts"/>

class StructureConstraint implements Constraint {
    shouldRemove:boolean = false;

    private _renderer: Renderer;
    private _restingDistance: number = 1;
    private _tearingDistance: number = 2;
    private _pointMassA: PointMass;
    private _pointMassB: PointMass;

    private _connectorLine: THREE.Line;

    constructor(restingDistance: number, pointMassA: PointMass, pointMassB: PointMass, renderer: Renderer){
        this._renderer = renderer;
        this._restingDistance = restingDistance;
        this._pointMassA = pointMassA;
        this._pointMassB = pointMassB;

        if(App.DEVELOPER_MODE){
            var geometry = new THREE.Geometry();
            geometry.vertices.push(this._pointMassA.position);
            geometry.vertices.push(this._pointMassB.position);
            this._connectorLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
            this._renderer.scene.add(this._connectorLine);
        }
    }


    public solve() {
        var delta = this._pointMassB.position.clone().sub(this._pointMassA.position);
        delta.normalize();
        var length = this._pointMassA.position.distanceTo(this._pointMassB.position);
        var offset = delta.multiplyScalar(length - this._restingDistance);

        var multiplier = 0.5;
        if (this._pointMassA.isAttatchment || this._pointMassB.isAttatchment)
            multiplier = 1;

        if (!this._pointMassA.isAttatchment)
            this._pointMassA.position.add(offset.clone().multiplyScalar(multiplier));

        if (!this._pointMassB.isAttatchment)
            this._pointMassB.position.sub(offset.clone().multiplyScalar(multiplier));

        if (App.DEVELOPER_MODE) {
            this._connectorLine.geometry.vertices[0].copy(this._pointMassA.position);
            this._connectorLine.geometry.vertices[1].copy(this._pointMassB.position);
            this._connectorLine.geometry.verticesNeedUpdate = true;
        }
    }
}