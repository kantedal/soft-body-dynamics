/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./renderer.ts"/>
///<reference path="./physics/cloth.ts"/>
///<reference path="./physics/soft_body.ts"/>
///<reference path="./physics/presets/soft_box.ts"/>
///<reference path="./gui/gui_handler.ts"/>
///<reference path="./gui/camera_selector.ts"/>
///<reference path="./physics/point_mass.ts"/>
///<reference path="lib/stats.d.ts"/>
///<reference path="./threejs/three.d.ts"/>
var App = (function () {
    function App() {
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();
        this._cloth = new Cloth(30, 50, this._renderer);
        var plane_geometry = new THREE.PlaneGeometry(4000, 4000, 1, 1);
        var plane_material = new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(plane_geometry, plane_material);
        plane.translateY(-30);
        plane.rotateX(Math.PI / 2);
        plane.receiveShadow = true;
        this._renderer.scene.add(plane);
        this._dimensions = new THREE.Vector3(150, 5, 5);
        this._softBox = new SoftBox(this._dimensions, this._renderer);
        this._guiHandler = new GuiHandler(this);
        this._cameraSelector = new CameraSelector(this._softBox, this._guiHandler, this._renderer);
    }
    App.prototype.start = function () {
        this._renderer.start();
        this._stats.setMode(0); // 0: fps, 1: ms, 2: mb
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '20px';
        this._stats.domElement.style.top = '20px';
        document.body.appendChild(this._stats.domElement);
        this.update();
    };
    App.prototype.update = function () {
        var _this = this;
        this._stats.begin();
        //this._cloth.update(this._clock.getElapsedTime(), 0.05);
        this._softBox.update(this._clock.getElapsedTime(), 0.05);
        this._cameraSelector.update();
        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(function () { return _this.update(); });
    };
    App.prototype.regenerateSoftBox = function () {
        this._renderer.scene.remove(this._softBox.bodyMesh);
        this._softBox = new SoftBox(this._dimensions, this._renderer);
        this._cameraSelector = new CameraSelector(this._softBox, this._guiHandler, this._renderer);
    };
    Object.defineProperty(App.prototype, "softBox", {
        get: function () {
            return this._softBox;
        },
        set: function (value) {
            this._softBox = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "dimensions", {
        get: function () {
            return this._dimensions;
        },
        set: function (value) {
            this._dimensions = value;
        },
        enumerable: true,
        configurable: true
    });
    App.DEVELOPER_MODE = false;
    App.CAST_SHADOW = true;
    return App;
})();
window.onload = function () {
    var app = new App();
    app.start();
};
//# sourceMappingURL=app.js.map