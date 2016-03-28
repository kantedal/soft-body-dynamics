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
    private _dampingFactor: number = 0.02;

    constructor(bodyMesh: THREE.Mesh, structureConstraintLimits: number[], bendConstraintLimits: number[], renderer: Renderer) {
        super();

        this._renderer = renderer;
        this._bodyMesh = bodyMesh;

        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos:THREE.Vector3 = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);

            this._points.push(new PointMass(vert_pos, 1, i));
        }

        for(var i=0; i<this._points.length; i++){
            for (var j = 0; j < this._points.length; j++) {
                if(j != i){
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if(distance >= structureConstraintLimits[0] && distance <= structureConstraintLimits[1]){
                        this._constraints.push(new StructureConstraint(distance, this._points[i], this._points[j], this._renderer));
                    }
                    else if(distance >= bendConstraintLimits[0] && distance <= bendConstraintLimits[1]){
                        this._constraints.push(new BendConstraint(distance, 0.02, this._points[i], this._points[j], this._renderer));
                    }
                }
                this._constraints.push(new HeightCollisionConstraint(-30, this._points[i]));
            }
        }
    }

    get bodyMesh():THREE.Mesh {
        return this._bodyMesh;
    }

    get points():PointMass[] {
        return this._points;
    }
}