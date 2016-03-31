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

class App {
    public static DEVELOPER_MODE = false;
    public static CAST_SHADOW = true;

    private _renderer: Renderer;
    private _guiHandler: GuiHandler;
    private _cameraSelector: CameraSelector;
    private _stats: Stats;
    private _clock: THREE.Clock;
    private _cloth: Cloth;
    private _softBox: SoftBox;
    private _dimensions: THREE.Vector3;

    public constructor(){
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();
        this._cloth = new Cloth(30,50,this._renderer);

        var plane_geometry = new THREE.PlaneGeometry( 4000, 4000, 1, 1 );
        var plane_material = new THREE.MeshPhongMaterial( {color: 0x999999, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( plane_geometry, plane_material );
        plane.translateY(-30);
        plane.rotateX(Math.PI/2);
        plane.receiveShadow = true;
        this._renderer.scene.add( plane );


        this._dimensions = new THREE.Vector3(150, 5, 5);
        this._softBox = new SoftBox(this._dimensions, this._renderer);
        this._guiHandler = new GuiHandler(this);
        this._cameraSelector = new CameraSelector(this._softBox, this._guiHandler, this._renderer);
    }

    public start():void{
        this._renderer.start();

        this._stats.setMode(0); // 0: fps, 1: ms, 2: mb
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '20px';
        this._stats.domElement.style.top = '20px';
        document.body.appendChild(this._stats.domElement);

        this.update();
    }

    private update(){
        this._stats.begin();

        //this._cloth.update(this._clock.getElapsedTime(), 0.05);
        this._softBox.update(this._clock.getElapsedTime(), 0.05);

        this._cameraSelector.update();

        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(() => this.update());
    }


    public regenerateSoftBox(){
        this._renderer.scene.remove(this._softBox.bodyMesh);
        this._softBox = new SoftBox(this._dimensions, this._renderer);
        this._cameraSelector = new CameraSelector(this._softBox, this._guiHandler, this._renderer);
    }

    get softBox():SoftBox {
        return this._softBox;
    }

    set softBox(value:SoftBox) {
        this._softBox = value;
    }

    get dimensions():THREE.Vector3 {
        return this._dimensions;
    }

    set dimensions(value:THREE.Vector3) {
        this._dimensions = value;
    }
}


window.onload = () => {
    var app = new App();
    app.start();
};