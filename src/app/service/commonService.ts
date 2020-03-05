import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

    constructor(@Inject(DOCUMENT) private document: Document) {
        
    }
    componentName: string
    public setIdentifyRouteComponent(componentName): void {
        return this.componentName=componentName;
    }
    public getIdentifyRouteComponent(): string {
        return this.componentName;
    }
}