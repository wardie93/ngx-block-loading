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
            const notDonePlayers = hasAnimations.players.filter(
                player => !player.done
            );
            if (notDonePlayers.length > 0) {
                const lastPlayerWrapper =
                    notDonePlayers[notDonePlayers.length - 1];
                lastPlayerWrapper.player.onDone(() => {
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
        const playerWrapper: AnimationPlayerWrapper = {
            player: player,
            done: false
        };
        player.onDone(() => {
            playerWrapper.done = true;

            if (destroyOnDone) {
                hasAnimations.players.forEach(player => {
                    player.player.destroy();
                });
            }

            if (hasAnimations.players.every(player => player.done)) {
                hasAnimations.players = [];
            }

            if (onDone) {
                onDone();
            }
        });
        player.play();
        hasAnimations.players.push(playerWrapper);
    }
}

export interface HasAnimations {
    readonly animationHelper: AnimationHelperService;
    players: AnimationPlayerWrapper[];
}

export interface AnimationPlayerWrapper {
    player: AnimationPlayer;
    done: boolean;
}
