import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2) {

    this.renderer = rendererFactory.createRenderer(null, null);
  }
  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if the script is already loaded
      if (document.querySelector(`script[src="${scriptUrl}"]`)) {
        resolve();
        return;
      }

      // Create script element
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptUrl;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      // Append script to the end of the body
      this.renderer.appendChild(document.body, script);
    });
  }
}
