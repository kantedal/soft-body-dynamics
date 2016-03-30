/**
 * Created by filles-dator on 2016-03-28.
 */

///<reference path="./point_mass.ts"/>
///<reference path="./integration.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="constraints/height_collision_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>

abstract class DynamicBody {
    protected _constraints: Constraint[];
    protected _integration: Integration;
    protected _bodyMesh: THREE.Mesh;
    protected _points: PointMass[];
    protected _pointMesh: THREE.Mesh[];
    protected _gravity: THREE.Vector3;
    protected _dampingFactor: number;

    constructor(bodyMesh: THREE.Mesh, integration: Integration){
        this._points = [];
        this._constraints = [];
        this._pointMesh = [];

        this._bodyMesh = bodyMesh;
        this._bodyMesh.castShadow = true;
        this._bodyMesh.receiveShadow = false;

        this._integration = integration;

        this._gravity = new THREE.Vector3(0, -9.82, 0);
        this._dampingFactor = 0.0;
    }

    public update(time: number, delta: number){
        for (var constraint of this._constraints)
            constraint.solve();

        this._bodyMesh.geometry.verticesNeedUpdate = true;

        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                point.acceleration = this._gravity.clone().add(point.constraintForce);
                this._integration.update(point, time, delta);
            }

            for(var j=0; j<point.vertexIndices.length; j++) {
                this._bodyMesh.geometry.vertices[point.vertexIndices[j]].copy(point.currentPos.clone());
            }

            if(this._pointMesh[i]){
                this._pointMesh[i].position.copy(point.currentPos);
            }
        }

        this._bodyMesh.geometry.verticesNeedUpdate = true;
        this._bodyMesh.geometry.normalsNeedUpdate = true;
        this._bodyMesh.geometry.computeFaceNormals();
        this._bodyMesh.geometry.computeVertexNormals();
        this._bodyMesh.geometry.computeBoundingSphere();
        //this._renderer.camera.lookAt(this._clothMesh.geometry.center().clone().multiplyScalar(-3));
    }

    protected pointInsideMesh(mesh: THREE.Mesh, point: THREE.Vector3):boolean{
        var raycastDirections = [
            new THREE.Vector3(1,0,0),
            new THREE.Vector3(-1,0,0),
            new THREE.Vector3(0,1,0),
            new THREE.Vector3(0,-1,0),
            new THREE.Vector3(0,0,1),
            new THREE.Vector3(0,0,-1),
        ];

        var raycaster = new THREE.Raycaster();
        for(var i=0; i<6; i++) {
            raycaster.set(point, raycastDirections[i]);
            var intersects = raycaster.intersectObject(mesh);
            if (intersects.length == 0)
                return false;
        }

        return true;
    }

}