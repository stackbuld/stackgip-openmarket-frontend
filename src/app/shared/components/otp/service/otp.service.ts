import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { OtpComponent } from '../otp.component';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private modalNotifier?: Subject<string>
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, @Inject(DOCUMENT) private dom: Document) { }

  open(content: TemplateRef<any>) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(OtpComponent)
    const contenViewRef = content.createEmbeddedView(null)
    const modalComponent = modalComponentFactory.create(this.injector, [contenViewRef.rootNodes])
    
    modalComponent.instance.closeEvent.subscribe(() => this.closeModal())
    modalComponent.hostView.detectChanges()

    
    this.dom.body.appendChild(modalComponent.location.nativeElement)

    this.modalNotifier = new Subject()

    return this.modalNotifier?.asObservable()
  }

  closeModal(){
     this.modalNotifier?.complete() 
    }
}
