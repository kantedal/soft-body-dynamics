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
    private _gravity: THREE.Vector3 = new THREE.Vector3(0, -9.82, 0);
    private _dampingFactor: number = 0.0;

    private _pointMesh: THREE.Mesh[];

    constructor(bodyMesh: THREE.Mesh, structureConstraintLimits: number[], bendConstraintLimits: number[], renderer: Renderer) {
        super();

        this._renderer = renderer;
        this._bodyMesh = bodyMesh;
        this._pointMesh = [];

        var samplingRateX = 5;
        var samplingRateY = 10;
        var samplingRateZ = 5;

        var body_geometry = bodyMesh.geometry.clone();
        body_geometry.computeBoundingBox();
        var boundingBox = body_geometry.boundingBox;

        for(var x=boundingBox.min.x; x<=boundingBox.max.x; x+=samplingRateX){
            for(var y=boundingBox.min.y; y<=boundingBox.max.y; y+=samplingRateY){
                for(var z=boundingBox.min.z; z<=boundingBox.max.z; z+=samplingRateZ){

                    if(this.pointInsideMesh(this._bodyMesh.clone(), new THREE.Vector3(x,y,z))){

                        var geometry = new THREE.SphereGeometry( 0.5, 8, 8 );
                        var material = new THREE.MeshBasicMaterial({
                            color: 0xff0000
                        });
                        var point = new THREE.Mesh( geometry.clone(), material );
                        point.position.set(x, y, z);
                        this._renderer.scene.add(point);
                        this._pointMesh.push(point);

                        this._points.push(new PointMass(new THREE.Vector3(x,y,z),1));
                    }

                }
            }
        }

        //this._points[0].isAttatchment = true;

        //for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
        //    var vert_pos:THREE.Vector3 = this._bodyMesh.geometry.vertices[i].clone();
        //    vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);
        //
        //    var point_mass = new PointMass(vert_pos,1);
        //    point_mass.attatchVertex(i)
        //    this._points.push();
        //}

        var max_distance = Math.sqrt(samplingRateX*samplingRateX + samplingRateY*samplingRateY + samplingRateZ*samplingRateZ);
        console.log(max_distance);
        for(var i=0; i<this._points.length; i++){
            for (var j = 0; j < this._points.length; j++) {
                if(j != i){
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if(distance <= max_distance){
                        this._constraints.push(new BendConstraint(distance, 0.1, this._points[i], this._points[j], this._renderer));
                    }
                }
            }
            this._constraints.push(new HeightCollisionConstraint(-30, this._points[i]));
        }

        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos:THREE.Vector3 = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);

            var closestIdx = 0;
            for(var j=1; j<this._points.length; j++) {
                if(vert_pos.distanceTo(this._points[j].currentPos) < vert_pos.distanceTo(this._points[closestIdx].currentPos))
                    closestIdx = j;
            }

            this._points[closestIdx].attatchVertex(i, this._points[closestIdx].currentPos.clone().sub(vert_pos));
        }

    }

    get bodyMesh():THREE.Mesh {
        return this._bodyMesh;
    }

    get points():PointMass[] {
        return this._points;
    }
}