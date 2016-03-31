/**
 * Created by filles-dator on 2016-03-31.
 */
///<reference path="./../../renderer.ts"/>
///<reference path="./../../app.ts"/>
///<reference path="./../../threejs/three.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SoftBox = (function (_super) {
    __extends(SoftBox, _super);
    function SoftBox(dimensions, renderer) {
        var body_geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z, dimensions.x / 5, dimensions.y / 5, dimensions.z / 5);
        var body_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x664444,
            specular: 0x225522,
            shininess: 100
        });
        var body_mesh = new THREE.Mesh(body_geometry, body_material);
        renderer.scene.add(body_mesh);
        var samplingRate = new THREE.Vector3(5, 5, 5);
        _super.call(this, body_mesh, samplingRate, renderer);
    }
    return SoftBox;
})(SoftBody);
//# sourceMappingURL=soft_box.js.map