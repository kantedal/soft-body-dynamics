/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>
var SoftBody = (function () {
    function SoftBody(bodyMesh, structureConstraintLimits, bendConstraintLimits, renderer) {
        this._gravity = new THREE.Vector3(0, -9.82, 0);
        this._dampingFactor = 0.02;
        this._renderer = renderer;
        this._bodyMesh = bodyMesh;
        this._points = [];
        this._pointMesh = [];
        this._structureConstraints = [];
        this._bendConstraints = [];
        for (var i = 0; i < this._bodyMesh.geometry.vertices.length; i++) {
            var vert_pos = this._bodyMesh.geometry.vertices[i].clone();
            vert_pos.applyMatrix4(this._bodyMesh.matrixWorld);
            this._points.push(new PointMass(vert_pos, 1, i));
        }
        //this._points[0].isAttatchment = true;
        for (var i = 0; i < this._points.length; i++) {
            for (var j = 0; j < this._points.length; j++) {
                if (j != i) {
                    var distance = this._points[i].currentPos.distanceTo(this._points[j].currentPos);
                    if (distance >= structureConstraintLimits[0] && distance <= structureConstraintLimits[1]) {
                        this._structureConstraints.push(new StructureConstraint(distance, this._points[i], this._points[j], this._renderer));
                    }
                    else if (distance >= bendConstraintLimits[0] && distance <= bendConstraintLimits[1]) {
                        this._bendConstraints.push(new BendConstraint(distance, 0.02, this._points[i], this._points[j], this._renderer));
                    }
                }
            }
        }
    }
    SoftBody.prototype.update = function (time, delta) {
        for (var _i = 0, _a = this._structureConstraints; _i < _a.length; _i++) {
            var constraint = _a[_i];
            constraint.solve();
        }
        for (var _b = 0, _c = this._bendConstraints; _b < _c.length; _b++) {
            var constraint = _c[_b];
            constraint.solve();
        }
        this._bodyMesh.geometry.verticesNeedUpdate = true;
        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                //point.constraintForce = this._windDirection.multiplyScalar(this._windDirection.dot())
                if (point.currentPos.y <= -30) {
                    point.constraintForce.copy(new THREE.Vector3(0, 1, 0).multiplyScalar(Math.abs(point.currentPos.y + 30) * 30));
                }
                else {
                    point.constraintForce.copy(new THREE.Vector3(0, 0, 0));
                }
                var acceleration = this._gravity.clone().add(point.constraintForce);
                var velocity = point.currentPos.clone().sub(point.lastPos);
                point.lastPos = point.currentPos.clone();
                point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
            }
            else {
            }
            this._bodyMesh.geometry.vertices[point.vertexIndex].copy(point.currentPos);
        }
        this._bodyMesh.geometry.verticesNeedUpdate = true;
        this._bodyMesh.geometry.normalsNeedUpdate = true;
        this._bodyMesh.geometry.computeFaceNormals();
        this._bodyMesh.geometry.computeVertexNormals();
        this._bodyMesh.geometry.computeBoundingSphere();
        //this._renderer.camera.lookAt(this._clothMesh.geometry.center().clone().multiplyScalar(-3));
    };
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
})();
//# sourceMappingURL=soft_body.js.map