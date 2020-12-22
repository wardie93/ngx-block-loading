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
        destroyOnDone: boolean = false,
        onDone?: () => void
    ): void {
        if (element) {
            if (hasAnimations.players.length > 0) {
                const lastPlayer =
                    hasAnimations.players[hasAnimations.players.length - 1];
                lastPlayer.onDone(() => {
                    this.runPlayer(
                        hasAnimations,
                        element,
                        metadata,
                        destroyOnDone,
                        onDone
                    );
                });
            } else {
                this.runPlayer(
                    hasAnimations,
                    element,
                    metadata,
                    destroyOnDone,
                    onDone
                );
            }
        }
    }

    runPlayer(
        hasAnimations: HasAnimations,
        element: ElementRef | undefined,
        metadata: AnimationReferenceMetadata,
        destroyOnDone: boolean = false,
        onDone?: () => void
    ): void {
        const factory = this.animationBuilder.build(useAnimation(metadata));
        const player = factory.create(element!.nativeElement);
        player.onDone(() => {
            if (destroyOnDone) {
                const index = hasAnimations.players.indexOf(player);
                player.destroy();
                hasAnimations.players.splice(index, 1);
            }
            if (onDone) {
                onDone();
            }
        });
        player.play();
        hasAnimations.players.push(player);
    }
}

export interface HasAnimations {
    readonly animationHelper: AnimationHelperService;
    players: AnimationPlayer[];
}
