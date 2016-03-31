/**
 * Created by filles-dator on 2016-03-28.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./../renderer.ts"/>
///<reference path="./../app.ts"/>
///<reference path="constraints/structure_constraint.ts"/>
///<reference path="constraints/bend_constraint.ts"/>
///<reference path="constraints/friction_constraint.ts"/>
///<reference path="constraints/height_collision_constraint.ts"/>
///<reference path="./../threejs/three.d.ts"/>
var DynamicBody = (function () {
    function DynamicBody(bodyMesh) {
        this._points = [];
        this._constraints = [];
        this._velocityConstraints = [];
        this._pointMesh = [];
        this._bodyMesh = bodyMesh;
        this._bodyMesh.castShadow = true;
        this._bodyMesh.receiveShadow = false;
        this._gravity = new THREE.Vector3(0, -9.82, 0);
        this._dampingFactor = 0.0;
    }
    DynamicBody.prototype.update = function (time, delta) {
        this._bodyMesh.geometry.verticesNeedUpdate = true;
        for (var _i = 0, _a = this._points; _i < _a.length; _i++) {
            var point = _a[_i];
            if (!point.isAttatchment) {
                point.acceleration = this._gravity.clone().add(point.constraintForce);
                point.velocity.add(point.acceleration.clone().multiplyScalar(delta));
                point.position = point.position.clone().add(point.velocity.clone().multiplyScalar(delta));
            }
        }
        for (var _b = 0, _c = this._constraints; _b < _c.length; _b++) {
            var constraint = _c[_b];
            constraint.solve();
        }
        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                point.velocity = point.position.clone().sub(point.nextPosition);
                point.velocity.multiplyScalar(1 / delta);
                point.nextPosition = point.position;
            }
            for (var j = 0; j < point.vertexIndices.length; j++) {
                this._bodyMesh.geometry.vertices[point.vertexIndices[j]].copy(point.position.clone());
            }
            if (App.DEVELOPER_MODE) {
                if (this._pointMesh[i]) {
                    this._pointMesh[i].position.copy(point.position);
                }
            }
        }
        for (var _d = 0, _e = this._velocityConstraints; _d < _e.length; _d++) {
            var constraint = _e[_d];
            constraint.solve();
        }
        this._bodyMesh.geometry.verticesNeedUpdate = true;
        this._bodyMesh.geometry.normalsNeedUpdate = true;
        this._bodyMesh.geometry.computeFaceNormals();
        this._bodyMesh.geometry.computeVertexNormals();
        this._bodyMesh.geometry.computeBoundingSphere();
        //this._renderer.camera.lookAt(this._clothMesh.geometry.center().clone().multiplyScalar(-3));
    };
    DynamicBody.prototype.pointInsideMesh = function (mesh, point) {
        var raycastDirections = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];
        var raycaster = new THREE.Raycaster();
        for (var i = 0; i < 6; i++) {
            raycaster.set(point, raycastDirections[i]);
            var intersects = raycaster.intersectObject(mesh);
            if (intersects.length == 0)
                return false;
        }
        return true;
    };
    return DynamicBody;
})();
//# sourceMappingURL=dynamic_body.js.map