import {Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Directive({
    selector: '[appAppShellRender]',
    standalone: false
})
export class AppShellRenderDirective implements OnInit {

  constructor( @Inject(PLATFORM_ID) private  platformId, private  templateRef: TemplateRef<any>,
               private viewContainer: ViewContainerRef) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }else{

    }
  }

}
