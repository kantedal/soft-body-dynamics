/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./dynamic_body.ts"/>
///<reference path="./integration.ts"/>
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
    function SoftBody(bodyMesh, integration, renderer) {
        _super.call(this, bodyMesh, integration);
        this._renderer = renderer;
        var samplingRateX = 5;
        var samplingRateY = 5;
        var samplingRateZ = 5;
        var body_geometry = bodyMesh.geometry.clone();
        body_geometry.computeBoundingBox();
        var boundingBox = body_geometry.boundingBox;
        for (var x = boundingBox.min.x; x <= boundingBox.max.x; x += samplingRateX) {
            for (var y = boundingBox.min.y; y <= boundingBox.max.y; y += samplingRateY) {
                for (var z = boundingBox.min.z; z <= boundingBox.max.z; z += samplingRateZ) {
                    if (this.pointInsideMesh(this._bodyMesh.clone(), new THREE.Vector3(x, y, z))) {
                        var geometry = new THREE.SphereGeometry(0.5, 8, 8);
                        var material = new THREE.MeshBasicMaterial({
                            color: 0xff0000
                        });
                        var point = new THREE.Mesh(geometry.clone(), material);
                        point.position.set(x, y, z);
                        //this._renderer.scene.add(point);
                        this._pointMesh.push(point);
                        this._points.push(new PointMass(new THREE.Vector3(x, y, z), 1));
                    }
                }
            }
        }
        var max_distance_structure = Math.sqrt(samplingRateX * samplingRateX + samplingRateY * samplingRateY + samplingRateZ * samplingRateZ);
        var max_distance_bend = Math.sqrt(2 * samplingRateX * samplingRateX + 2 * samplingRateY * samplingRateY + 2 * samplingRateZ * samplingRateZ);
        for (var i = 0; i < this._points.length; i++) {
            for (var j = 0; j < this._points.length; j++) {
                if (j != i) {
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if (distance <= max_distance_structure) {
                        this._constraints.push(new BendConstraint(distance, 0.8, this._points[i], this._points[j], this._renderer));
                    }
                    else if (distance <= max_distance_bend) {
                        this._constraints.push(new BendConstraint(distance, 0.4, this._points[i], this._points[j], this._renderer));
                    }
                }
            }
            this._constraints.push(new HeightCollisionConstraint(-30, this._points[i]));
            this._constraints.push(new FrictionConstraint(this._points[i]));
        }
        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);
            var closestIdx = 0;
            for (var j = 1; j < this._points.length; j++) {
                if (vert_pos.distanceTo(this._points[j].currentPos) < vert_pos.distanceTo(this._points[closestIdx].currentPos))
                    closestIdx = j;
            }
            this._points[closestIdx].attatchVertex(i, this._points[closestIdx].currentPos.clone().sub(vert_pos));
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