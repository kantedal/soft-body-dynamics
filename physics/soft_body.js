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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SoftBody = (function (_super) {
    __extends(SoftBody, _super);
    function SoftBody(bodyMesh, structureConstraintLimits, bendConstraintLimits, renderer) {
        _super.call(this);
        this._gravity = new THREE.Vector3(0, -9.82, 0);
        this._dampingFactor = 0.02;
        this._renderer = renderer;
        this._bodyMesh = bodyMesh;
        this._pointMesh = [];
        var samplingRate = 5;
        bodyMesh.geometry.computeBoundingBox();
        var boundingBox = bodyMesh.geometry.boundingBox;
        console.log(boundingBox.max);
        console.log(boundingBox.min);
        var geometry = new THREE.SphereGeometry(0.5, 4, 4);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        for (var x = boundingBox.min.x; x <= boundingBox.max.x; x += samplingRate) {
            for (var y = boundingBox.min.y; y <= boundingBox.max.y; y += samplingRate) {
                for (var z = boundingBox.min.z; z <= boundingBox.max.z; z += samplingRate) {
                    var point = new THREE.Mesh(geometry.clone(), material);
                    point.position.set(x, y, z);
                    this._renderer.scene.add(point);
                }
            }
        }
        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);
            this._points.push(new PointMass(vert_pos, 1, i));
        }
        for (var i = 0; i < this._points.length; i++) {
            for (var j = 0; j < this._points.length; j++) {
                if (j != i) {
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if (distance >= structureConstraintLimits[0] && distance <= structureConstraintLimits[1]) {
                        this._constraints.push(new StructureConstraint(distance, this._points[i], this._points[j], this._renderer));
                    }
                    else if (distance >= bendConstraintLimits[0] && distance <= bendConstraintLimits[1]) {
                        this._constraints.push(new BendConstraint(distance, 0.02, this._points[i], this._points[j], this._renderer));
                    }
                }
                this._constraints.push(new HeightCollisionConstraint(-30, this._points[i]));
            }
        }
    }
    Object.defineProperty(SoftBody.prototype, "bodyMesh", {
        get: function () {
            return this._bodyMesh;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoftBody.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: true,
        configurable: true
    });
    return SoftBody;
})(DynamicBody);
//# sourceMappingURL=soft_body.js.map