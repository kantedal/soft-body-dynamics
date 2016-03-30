/**
 * Created by filles-dator on 2016-03-30.
 */

///<reference path="./point_mass.ts"/>
class Integration {
    public static VERLET: number = 0;
    public static RUNGE_KUTTA_4: number = 1;
    public static EULER: number = 2;

    private _method: number;

    constructor(method: number){
        this._method = method;
    }

    public update(point: PointMass, time:number, delta:number){
        switch (this._method){
            case Integration.VERLET:
                this.verlet(point, time, delta);
                break;
            case Integration.RUNGE_KUTTA_4:

                break;
            case Integration.EULER:
                this.euler(point, time, delta);
                break;
            default:
                break;
        }
    }

    private verlet(point: PointMass, time:number, delta:number){
        point.velocity = point.currentPos.clone().sub(point.lastPos);
        point.lastPos = point.currentPos.clone();
        point.currentPos = point.currentPos.clone().add(point.velocity.clone().multiplyScalar(1.0 - 0.0)).add(point.acceleration.multiplyScalar(delta * delta));
    }

    private euler(point: PointMass, time:number, delta:number){
        point.velocity.add(point.acceleration.clone().multiplyScalar(delta));
        point.currentPos.add(point.velocity.clone().multiplyScalar(delta));
    }

    get method():number {
        return this._method;
    }

    set method(value:number) {
        this._method = value;
    }
}