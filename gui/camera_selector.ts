/**
 * Created by filles-dator on 2016-03-29.
 */
///<reference path="./../physics/soft_body.ts"/>
///<reference path="./../physics/point_mass.ts"/>

class CameraSelector {
    private _renderer: Renderer;
    private _guiHandler;
    private _softBody: SoftBody;

    private _raycaster: THREE.Raycaster;
    private _raycasterIntersects: THREE.Intersection[];
    private _raycasterSelector: THREE.Mesh;
    private _raycasterSelectorPlane: THREE.Mesh;
    private _selectedPointMass: PointMass;
    private _dragAllowed: boolean;
    private _isDragging: boolean;
    private _dragPosition: THREE.Vector3;
    private _mouse: THREE.Vector2;

    constructor(softBody: SoftBody, guiHandler: GuiHandler, renderer: Renderer){
        this._renderer = renderer;
        this._softBody = softBody;
        this._guiHandler = guiHandler;

        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0,0);
        this._dragAllowed = false;
        this._isDragging = false;
        this._dragPosition = new THREE.Vector3(0,0,0);

        this._raycasterSelector = new THREE.Mesh( new THREE.SphereGeometry( 1, 8, 8 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
        this._renderer.scene.add( this._raycasterSelector );

        this._raycasterSelectorPlane = new THREE.Mesh(
            new THREE.PlaneGeometry( 50, 50, 1, 1 ),
            new THREE.MeshLambertMaterial({color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.0})
        );
        this._renderer.scene.add(this._raycasterSelectorPlane);
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);

        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
    }

    public update(){
        this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);

        this._dragAllowed = false;

        if(this._isDragging){
            this._raycaster.setFromCamera( this._mouse, this._renderer.camera );
            this._raycasterIntersects = this._raycaster.intersectObject( this._raycasterSelectorPlane );
            if(this._raycasterIntersects.length != 0){
                this._raycasterSelector.visible = true;
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
        }
        else
        {
            this._raycaster.setFromCamera( this._mouse, this._renderer.camera );
            this._raycasterIntersects = this._raycaster.intersectObject( this._softBody.bodyMesh );
            this._raycasterSelectorPlane.rotation.copy(this._renderer.camera.rotation);

            if(this._raycasterIntersects.length != 0){
                this._dragAllowed = true;
                this._raycasterSelector.visible = true;
                this._raycasterSelectorPlane.position.copy(this._raycasterIntersects[0].point.clone());
                this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
            }
            else{
                if(!this._isDragging){
                    this._raycasterSelector.visible = false;
                }
            }
        }
    }

    private mouseDown = (ev: MouseEvent) => {
        if(this._dragAllowed){
            this._renderer.controls.enabled = false;

            this._selectedPointMass = this._softBody.points[0];
            var closestDistance = 1000;
            for(var point of this._softBody.points){
                var distance = point.currentPos.distanceTo(this._raycasterSelector.position);
                if(distance < closestDistance){
                    this._selectedPointMass = point;
                    closestDistance = distance;
                }
            }
            this._selectedPointMass.isAttatchment = true;
            this._isDragging = true;
            this._dragAllowed = false;
        }
    }

    private mouseUp = (ev: MouseEvent) => {
        if(this._isDragging){
            this._isDragging = false;
            this._dragAllowed = false;

            if(this._guiHandler.selectionMode == GuiHandler.MOVE_CLOTH)
                this._selectedPointMass.isAttatchment = false;

            this._renderer.controls.enabled = true;
        }
    }

    private mouseMove = (ev: MouseEvent) => {
        this._mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;

        if(this._isDragging){
            this._selectedPointMass.currentPos.copy(this._raycasterSelector.position);
        }
    }
}