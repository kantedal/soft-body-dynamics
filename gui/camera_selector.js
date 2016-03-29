/**
 * Created by filles-dator on 2016-03-29.
 */
///<reference path="./../physics/soft_body.ts"/>
///<reference path="./../physics/point_mass.ts"/>
var CameraSelector = (function () {
    function CameraSelector(softBody, guiHandler, renderer) {
        var _this = this;
        this.mouseDown = function (ev) {
            if (_this._dragAllowed) {
                _this._renderer.controls.enabled = false;
                _this._selectedPointMass = _this._softBody.points[0];
                var closestDistance = 1000;
                for (var _i = 0, _a = _this._softBody.points; _i < _a.length; _i++) {
                    var point = _a[_i];
                    var distance = point.currentPos.distanceTo(_this._raycasterSelector.position);
                    if (distance < closestDistance) {
                        _this._selectedPointMass = point;
                        closestDistance = distance;
                    }
                }
                _this._selectedPointMass.isAttatchment = true;
                _this._isDragging = true;
                _this._dragAllowed = false;
            }
        };
        this.mouseUp = function (ev) {
            if (_this._isDragging) {
                _this._isDragging = false;
                _this._dragAllowed = false;
                if (_this._guiHandler.selectionMode == GuiHandler.MOVE_CLOTH)
                    _this._selectedPointMass.isAttatchment = false;
                _this._renderer.controls.enabled = true;
            }
        };
        this.mouseMove = function (ev) {
            _this._mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
            _this._mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
            if (_this._isDragging) {
                _this._selectedPointMass.currentPos.copy(_this._raycasterSelector.position);
            }
        };
        this._renderer = renderer;
        this._softBody = softBody;
        this._guiHandler = guiHandler;
        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0, 0);
        this._dragAllowed = false;
        this._isDragging = false;
        this._dragPosition = new THREE.Vector3(0, 0, 0);
        this._raycasterSelector = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this._renderer.scene.add(this._raycasterSelector);
        this._raycasterSelectorPlane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1, 1), new THREE.MeshLambertMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.0 }));
        this._renderer.scene.add(this._raycasterSelectorPlane);
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
    }
    CameraSelector.prototype.update = function () {
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
        this._dragAllowed = false;
        if (this._isDragging) {
            this._raycaster.setFromCamera(this._mouse, this._renderer.camera);
            this._raycasterIntersects = this._raycaster.intersectObject(this._raycasterSelectorPlane);
            if (this._raycasterIntersects.length != 0) {
                this._raycasterSelector.visible = true;
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
        }
        else {
            this._raycaster.setFromCamera(this._mouse, this._renderer.camera);
            this._raycasterIntersects = this._raycaster.intersectObject(this._softBody.bodyMesh);
            this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);
            if (this._raycasterIntersects.length != 0) {
                this._dragAllowed = true;
                this._raycasterSelector.visible = true;
                this._raycasterSelectorPlane.position.copy(this._raycasterIntersects[0].point.clone());
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
            else {
                if (!this._isDragging) {
                    this._raycasterSelector.visible = false;
                }
            }
        }
    };
    return CameraSelector;
})();
//# sourceMappingURL=camera_selector.js.map