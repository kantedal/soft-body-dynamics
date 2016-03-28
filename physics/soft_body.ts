/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>

class SoftBody {

    private _renderer: Renderer;
    private _points: PointMass[];
    private _pointMesh: THREE.Mesh[];
    private _structureConstraints: StructureConstraint[];
    private _bendConstraints: BendConstraint[];
    private _bodyMesh: THREE.Mesh;

    private _gravity: THREE.Vector3 = new THREE.Vector3(0, -9.82, 0);
    private _dampingFactor: number = 0.02;

    public constructor(bodyMesh: THREE.Mesh, structureConstraintLimits: number[], bendConstraintLimits: number[], renderer: Renderer) {
        this._renderer = renderer;
        this._bodyMesh = bodyMesh;
        this._points = [];
        this._pointMesh = [];
        this._structureConstraints = [];
        this._bendConstraints = [];

        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos:THREE.Vector3 = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);

            this._points.push(new PointMass(vert_pos, 1, i));
        }

        //this._points[0].isAttatchment = true;

        for(var i=0; i<this._points.length; i++){
            for (var j = 0; j < this._points.length; j++) {
                if(j != i){
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if(distance >= structureConstraintLimits[0] && distance <= structureConstraintLimits[1]){
                        this._structureConstraints.push(new StructureConstraint(distance, this._points[i], this._points[j], this._renderer));
                    }
                    else if(distance >= bendConstraintLimits[0] && distance <= bendConstraintLimits[1]){
                        this._bendConstraints.push(new BendConstraint(distance, 0.02, this._points[i], this._points[j], this._renderer));
                    }
                }
            }
        }
    }

    public update(time: number, delta: number){
        for (var constraint of this._structureConstraints)
            constraint.solve();

        for (var constraint of this._bendConstraints)
            constraint.solve();

        this._bodyMesh.geometry.verticesNeedUpdate = true;

        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                //point.constraintForce = this._windDirection.multiplyScalar(this._windDirection.dot())
                if(point.currentPos.y <= -30) {
                    point.constraintForce.copy(new THREE.Vector3(0,1,0).multiplyScalar(Math.abs(point.currentPos.y+30)*30));
                }else{
                    point.constraintForce.copy(new THREE.Vector3(0,0,0));
                }
                var acceleration = this._gravity.clone().add(point.constraintForce);
                var velocity = point.currentPos.clone().sub(point.lastPos);
                point.lastPos = point.currentPos.clone();
                point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
            }
            else {
                //point.currentPos.add(new THREE.Vector3(Math.sin(time*2)*0.2, Math.cos(time*2)*0.2, Math.cos(time*2)*0.2));
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

    get bodyMesh():THREE.Mesh {
        return this._bodyMesh;
    }

    get points():PointMass[] {
        return this._points;
    }
}