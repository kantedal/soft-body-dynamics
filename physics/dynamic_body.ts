/**
 * Created by filles-dator on 2016-03-28.
 */

///<reference path="./point_mass.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="constraints/height_collision_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>

abstract class DynamicBody {
    protected _constraints: Constraint[];
    protected _bodyMesh: THREE.Mesh;
    protected _points: PointMass[];

    constructor(){
        this._points = [];
        this._constraints = [];
    }

    public update(time: number, delta: number){
        for (var constraint of this._constraints)
            constraint.solve();

        this._bodyMesh.geometry.verticesNeedUpdate = true;

        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                //point.constraintForce = this._windDirection.multiplyScalar(this._windDirection.dot())

                var acceleration = this._gravity.clone().add(point.constraintForce);
                var velocity = point.currentPos.clone().sub(point.lastPos);
                point.lastPos = point.currentPos.clone();
                point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
            }

            this._bodyMesh.geometry.vertices[point.vertexIndex].copy(point.currentPos);
        }

        this._bodyMesh.geometry.verticesNeedUpdate = true;
        this._bodyMesh.geometry.normalsNeedUpdate = true;
        this._bodyMesh.geometry.computeFaceNormals();
        this._bodyMesh.geometry.computeVertexNormals();
        this._bodyMesh.geometry.computeBoundingSphere();
        //this._renderer.camera.lookAt(this._clothMesh.geometry.center().clone().multiplyScalar(-3));
    }

}