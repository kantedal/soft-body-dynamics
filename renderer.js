///<reference path="./threejs/three.d.ts"/>
///<reference path="./threejs/three-orbitcontrols.d.ts"/>
///<reference path="./threejs/three-editorcontrols.d.ts"/>
///<reference path="./app.ts"/>
var Renderer = (function () {
    function Renderer() {
        var _this = this;
        this.onWindowResize = function () {
            _this._camera.aspect = window.innerWidth / window.innerHeight;
            _this._camera.updateProjectionMatrix();
            _this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        this._scene = new THREE.Scene();
        this._scene.fog = new THREE.Fog(0x808080, 200, 1000);
        this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1.1, 5000);
        this._controls = new THREE.EditorControls(this._camera);
        this._camera.position.set(0, 15, -70);
        this._cameraLookAt = new THREE.Vector3(0, 0, 0);
        this._camera.lookAt(this._cameraLookAt);
        this._cameraBasePosition = new THREE.Vector3();
        this._cameraBasePosition.copy(this._camera.position);
        //this._light = new THREE.DirectionalLight( 0xffeeee, 1.0 );
        //this._light.position.set( 1, 1, 0 );
        //this._light.castShadow = true;
        //this._light.shadowDarkness = 0.5;
        //this._scene.add( this._light );
        this._light = new THREE.SpotLight(0xffffff);
        this._light.position.set(150, 50, 200);
        this._light.decay = 0.1;
        this._light.exponent = 0.2;
        this._scene.add(this._light);
        this._light.parent = this._camera;
        if (App.CAST_SHADOW) {
            this._light.castShadow = true;
            this._light.shadow.mapSize.width = 1024;
            this._light.shadow.mapSize.height = 1024;
            this._light.shadowDarkness = 0.5;
        }
        var ambientLight = new THREE.AmbientLight(0x505050); // soft white light
        this.scene.add(ambientLight);
        var container = document.getElementById('content');
        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize, false);
    }
    Renderer.prototype.render = function () {
        this.renderer.render(this._scene, this._camera);
    };
    Renderer.prototype.start = function () {
        this.render();
    };
    Object.defineProperty(Renderer.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        set: function (value) {
            this._scene = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        set: function (value) {
            this._camera = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "cameraBasePosition", {
        get: function () {
            return this._cameraBasePosition;
        },
        set: function (value) {
            this._cameraBasePosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "cameraLookAt", {
        get: function () {
            return this._cameraLookAt;
        },
        set: function (value) {
            this._cameraLookAt = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        set: function (value) {
            this._controls = value;
        },
        enumerable: true,
        configurable: true
    });
    return Renderer;
})();
//# sourceMappingURL=renderer.js.map