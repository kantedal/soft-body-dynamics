/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./renderer.ts"/>
///<reference path="./physics/cloth.ts"/>
///<reference path="./physics/soft_body.ts"/>
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
    private _softBody: SoftBody;

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

        var cube_geometry = new THREE.BoxGeometry( 100, 5, 5, 20, 1, 1 );
        var cube_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x664444,
            specular: 0x225522,
            shininess: 100
        });
        var cube = new THREE.Mesh( cube_geometry, cube_material );
        this._renderer.scene.add( cube );
        this._softBody = new SoftBody(cube, this._renderer);

        //var geometry = new THREE.SphereGeometry( 20, 8, 8 );
        //var material = new THREE.MeshPhongMaterial({
        //    side: THREE.DoubleSide,
        //    color: 0x444499,
        //    specular: 0x222222,
        //    shininess: 1000
        //});
        //var sphere = new THREE.Mesh( geometry, material );
        //this._renderer.scene.add( sphere );
        //this._softBody = new SoftBody(sphere, [0,4], [19,21], this._renderer);


        this._guiHandler = new GuiHandler(this._cloth);
        this._cameraSelector = new CameraSelector(this._softBody, this._guiHandler, this._renderer);
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
        this._softBody.update(this._clock.getElapsedTime(), 0.05);

        this._cameraSelector.update();

        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(() => this.update());
    }
}


window.onload = () => {
    var app = new App();
    app.start();
};