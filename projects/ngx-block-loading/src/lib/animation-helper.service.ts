import {
  AnimationBuilder,
  AnimationPlayer,
  AnimationReferenceMetadata,
  useAnimation
} from '@angular/animations';
import { ElementRef, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AnimationHelperService {
    constructor(private readonly animationBuilder: AnimationBuilder) {}

    animate(
        hasAnimations: HasAnimations,
        element: ElementRef | undefined,
        metadata: AnimationReferenceMetadata,
        onDone?: () => void
    ): void {
        if (element) {
            if (hasAnimations.player) {
                hasAnimations.player.onDone(() => {
                    this.runPlayer(hasAnimations, element, metadata, onDone);
                });
            } else {
                this.runPlayer(hasAnimations, element, metadata, onDone);
            }
        }
    }

    runPlayer(
        hasAnimations: HasAnimations,
        element: ElementRef | undefined,
        metadata: AnimationReferenceMetadata,
        onDone?: () => void
    ): void {
        const factory = this.animationBuilder.build(useAnimation(metadata));
        hasAnimations.player = factory.create(element!.nativeElement);
        hasAnimations.player.onDone(() => {
            hasAnimations.player?.destroy();
            hasAnimations.player = undefined;
            if (onDone) {
                onDone();
            }
        });
        hasAnimations.player.play();
    }
}

export interface HasAnimations {
    readonly animationHelper: AnimationHelperService;
    player?: AnimationPlayer;
}
