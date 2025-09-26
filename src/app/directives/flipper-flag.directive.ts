// src/app/directives/feature-flag.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {FlipperFlagsService} from "../services/flipper-flags.service";

@Directive({
  selector: '[flipperFlag]' // usage: *featureFlag="'flagName'"
})
export class FlipperFlagDirective {
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private flags: FlipperFlagsService
  ) {}

  @Input() set flipperFlag(flagName: string) {
    if (this.flags.isEnabled(flagName)) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
