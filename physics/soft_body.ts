/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./dynamic_body.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>

class SoftBody extends DynamicBody {
    private _renderer: Renderer;

    constructor(bodyMesh: THREE.Mesh, samplingRate: THREE.Vector3, renderer: Renderer) {
        super(bodyMesh);
        this._renderer = renderer;

        var body_geometry = bodyMesh.geometry.clone();
        body_geometry.computeBoundingBox();
        var boundingBox = body_geometry.boundingBox;

        for(var x=boundingBox.min.x; x<=boundingBox.max.x; x+=samplingRate.x){
            for(var y=boundingBox.min.y; y<=boundingBox.max.y; y+=samplingRate.y){
                for(var z=boundingBox.min.z; z<=boundingBox.max.z; z+=samplingRate.z){

                    if(this.pointInsideMesh(this._bodyMesh.clone(), new THREE.Vector3(x,y,z))){

                        var geometry = new THREE.SphereGeometry( 0.5, 8, 8 );
                        var material = new THREE.MeshBasicMaterial({
                            color: 0xff0000
                        });
                        var point = new THREE.Mesh( geometry.clone(), material );
                        point.position.set(x, y, z);
                        //this._renderer.scene.add(point);
                        this._pointMesh.push(point);

                        this._points.push(new PointMass(new THREE.Vector3(x,y,z),1));
                    }
                }
            }
        }

        var max_distance_structure = Math.sqrt(samplingRate.x*samplingRate.x + samplingRate.y*samplingRate.y + samplingRate.z*samplingRate.z);
        var max_distance_bend = Math.sqrt(2*samplingRate.x*samplingRate.x + 2*samplingRate.y*samplingRate.y + 2*samplingRate.z*samplingRate.z);

        for(var i=0; i<this._points.length; i++){
            for (var j = 0; j < this._points.length; j++) {
                if(j != i){
                    var distance = this._points[i].position.distanceTo(this._points[j].position);
                    if(distance <= max_distance_structure){
                        this._constraints.push(new BendConstraint(distance, 0.7, this._points[i], this._points[j], this._renderer));
                    }else if(distance <= max_distance_bend){
                        this._constraints.push(new BendConstraint(distance, 0.3, this._points[i], this._points[j], this._renderer));
                    }
                }
            }
            this._constraints.push(new HeightCollisionConstraint(-30, this._points[i]));
            this._velocityConstraints.push(new FrictionConstraint(this._points[i]));
        }

        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos:THREE.Vector3 = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);

            var closestIdx = 0;
            for(var j=1; j<this._points.length; j++) {
                if(vert_pos.distanceTo(this._points[j].position) < vert_pos.distanceTo(this._points[closestIdx].position))
                    closestIdx = j;
            }

            this._points[closestIdx].attatchVertex(i, this._points[closestIdx].position.clone().sub(vert_pos));
        }

    }

    get bodyMesh():THREE.Mesh {
        return this._bodyMesh;
    }

    get points():PointMass[] {
        return this._points;
    }
}