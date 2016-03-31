/**
 * Created by filles-dator on 2016-03-31.
 */
///<reference path="./../../renderer.ts"/>
///<reference path="./../../app.ts"/>
///<reference path="./../../threejs/three.d.ts"/>

class SoftBox extends SoftBody{
    constructor(dimensions: THREE.Vector3, renderer: Renderer) {
        var body_geometry = new THREE.BoxGeometry(
            dimensions.x,
            dimensions.y,
            dimensions.z,
            dimensions.x/5,
            dimensions.y/5,
            dimensions.z/5
        );

        var body_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x664444,
            specular: 0x225522,
            shininess: 100
        });

        var body_mesh = new THREE.Mesh( body_geometry, body_material );
        renderer.scene.add( body_mesh );

        var samplingRate: THREE.Vector3 = new THREE.Vector3(5,5,5);
        super(body_mesh, samplingRate, renderer);
    }
}