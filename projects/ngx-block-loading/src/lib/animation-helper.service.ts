import {
    animate,
    animation,
    AnimationBuilder,
    AnimationPlayer,
    AnimationReferenceMetadata,
    AnimationStyleMetadata, style,
    useAnimation
} from '@angular/animations';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AnimationHelperService {
    private readonly hasLoadingElement: ElementRef[] = [];
    private readonly players: {
        element: ElementRef;
        players: AnimationPlayerWrapper[];
    }[] = [];
    private readonly loadingElements: {
        element: ElementRef;
        loadingElement: ElementRef;
    }[] = [];

    constructor(private readonly animationBuilder: AnimationBuilder) { }

    private elementRefEquals(
        one: ElementRef | undefined,
        two: ElementRef | undefined
    ): boolean {
        return one?.nativeElement.isSameNode(two?.nativeElement);
    }

    private getPlayerWrapperIndex(element: ElementRef | undefined): number {
        const playerWrapperIndex = this.players.findIndex(e =>
            this.elementRefEquals(e.element, element)
        );
        return playerWrapperIndex;
    }

    private addPlayer(
        element: ElementRef | undefined,
        player: AnimationPlayerWrapper
    ): void {
        if (!element) {
            return;
        }

        const playerWrapperIndex = this.getPlayerWrapperIndex(element);

        if (playerWrapperIndex === -1) {
            this.players.push({ element: element, players: [player] });
            return;
        }

        const playerWrapper = this.players[playerWrapperIndex];

        this.players[playerWrapperIndex] = {
            element: element,
            players: playerWrapper.players.concat(player)
        };
    }

    private getPlayers(
        element: ElementRef | undefined
    ): AnimationPlayerWrapper[] {
        const playerWrapperIndex = this.getPlayerWrapperIndex(element);

        if (playerWrapperIndex === -1) {
            return [];
        }

        const players = this.players[playerWrapperIndex].players;
        return players;
    }

    private clearPlayers(element: ElementRef | undefined): void {
        const playerWrapperIndex = this.getPlayerWrapperIndex(element);

        if (playerWrapperIndex === -1) {
            return;
        }

        this.players.splice(playerWrapperIndex, 1);
    }

    private getLoadingElementIndex(element: ElementRef | undefined): number {
        const loadingElementIndex = this.loadingElements.findIndex(e =>
            this.elementRefEquals(e.element, element)
        );
        return loadingElementIndex;
    }

    private addLoadingElement(
        element: ElementRef | undefined,
        loadingElement: ElementRef
    ): void {
        if (!element) {
            return;
        }

        const loadingElementIndex = this.getLoadingElementIndex(element);

        if (loadingElementIndex === -1) {
            this.loadingElements.push({
                element: element,
                loadingElement: loadingElement
            });
        }
    }

    private getLoadingElement(
        element: ElementRef | undefined
    ): ElementRef | undefined {
        if (!element) {
            return;
        }

        const loadingElementIndex = this.getLoadingElementIndex(element);

        if (loadingElementIndex === -1) {
            return undefined;
        }

        const loadingElement =
            this.loadingElements[loadingElementIndex].loadingElement;

        if (!loadingElement.nativeElement.parentNode) {
            loadingElement.nativeElement.parentNode = element.nativeElement;
        }

        return loadingElement;
    }

    private removeLoadingElement(element: ElementRef | undefined): void {
        const loadingElementIndex = this.getLoadingElementIndex(element);

        if (loadingElementIndex === -1) {
            return;
        }

        this.loadingElements.splice(loadingElementIndex, 1);
    }

    isElementLoading(element: ElementRef | undefined): boolean {
        if (!element) {
            return false;
        }

        return this.hasLoadingElement.some(e =>
            this.elementRefEquals(e, element)
        );
    }

    private runPlayer(
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

            const players = this.getPlayers(element);

            if (destroyOnDone) {
                players.forEach(animationPlayer => {
                    this.tryRunMethodOnPlayer(() =>
                        animationPlayer.player.destroy()
                    );
                });
            }

            if (players.every(player => player.done)) {
                this.clearPlayers(element);
            }

            if (onDone) {
                onDone();
            }
        });
        player.play();
        this.addPlayer(element, playerWrapper);
    }

    private isAnimationPlayerDone(player: AnimationPlayerWrapper): boolean {
        return (
            player.done ||
            player.player.totalTime === player.player.getPosition()
        );
    }

    private tryRunMethodOnPlayer(
        playerMethod: () => void,
        callbackIfFailed?: () => void
    ): void {
        try {
            playerMethod();
        } catch (error: any) {
            // This error means that the player has been destroyed
            // However, Angular doesn't provide a means of checking if this has been done already
            // So we have to catch the error
            if (
                error &&
                error.message &&
                !error.message.includes(
                    'Unable to find the timeline player referenced by'
                )
            ) {
                throw error;
            }

            if (callbackIfFailed) {
                callbackIfFailed();
            }
        }
    }

    animate(
        element: ElementRef | undefined,
        metadata: AnimationReferenceMetadata,
        destroyOnDone: boolean = false,
        onDone?: () => void
    ): void {
        if (element) {
            const players = this.getPlayers(element);
            const notDonePlayers = players.filter(
                player => !this.isAnimationPlayerDone(player)
            );
            if (notDonePlayers.length > 0) {
                const lastPlayerWrapper =
                    notDonePlayers[notDonePlayers.length - 1];
                this.tryRunMethodOnPlayer(
                    () =>
                        lastPlayerWrapper.player.onDone(() => {
                            this.runPlayer(
                                element,
                                metadata,
                                destroyOnDone,
                                onDone
                            );
                        }),
                    () => {
                        this.runPlayer(
                            element,
                            metadata,
                            destroyOnDone,
                            onDone
                        );
                    }
                );
            } else {
                this.runPlayer(element, metadata, destroyOnDone, onDone);
            }
        }
    }

    tryCreateLoadingElement(
        element: ElementRef | undefined,
        loadingElement: ElementRef,
        classes: { loading: string; container: string; },
        styles: {
            containerLoading: AnimationStyleMetadata;
            containerNotLoading: AnimationStyleMetadata;
        },
        inTime: string,
        renderer: Renderer2,
        addLoadingClass: boolean
    ): void {
        if (!element || this.isElementLoading(element)) {
            return;
        }

        renderer.addClass(element.nativeElement, classes.container);

        renderer.appendChild(
            element.nativeElement,
            loadingElement!.nativeElement
        );
        if (addLoadingClass) {
            renderer.addClass(loadingElement!.nativeElement, classes.loading);
        }

        this.addLoadingElement(element, loadingElement);
        this.hasLoadingElement.push(element);

        this.animate(
            element,
            animation([
                styles.containerNotLoading,
                animate(inTime, styles.containerLoading)
            ])
        );
    }

    tryRemoveLoadingElement(
        element: ElementRef | undefined,
        classes: { container: string; },
        styles: {
            loading: AnimationStyleMetadata;
            loadingContainer: AnimationStyleMetadata,
            notLoading: AnimationStyleMetadata;
        },
        times: { outTime: string; loaderOutTime: string; },
        renderer: Renderer2
    ): void {
        if (!element || !this.isElementLoading(element)) {
            return;
        }

        const loadingElement = this.getLoadingElement(element);

        const players = this.getPlayers(element);

        players.forEach(player => {
            if (!this.isAnimationPlayerDone(player)) {
                this.tryRunMethodOnPlayer(() => player.player.destroy());
            }
        });
        this.animate(
            element,
            animation([
                styles.loadingContainer,
                animate(
                    times.outTime,
                    style({
                        height: element.nativeElement.scrollHeight
                    })
                )
            ]),
            true,
            () => {
                const hasLoadingElementIndex = this.hasLoadingElement.findIndex(
                    e => this.elementRefEquals(e, element)
                );

                if (hasLoadingElementIndex > -1) {
                    this.hasLoadingElement.splice(hasLoadingElementIndex, 1);
                }

                this.animate(
                    loadingElement,
                    animation([
                        styles.loading,
                        animate(times.loaderOutTime, styles.notLoading)
                    ]),
                    true,
                    () => {
                        if (loadingElement) {
                            renderer.removeChild(
                                element!.nativeElement,
                                loadingElement!.nativeElement
                            );

                            this.removeLoadingElement(element);
                        } else {
                            throw new Error(
                                'There is no element that was created for blocking, something has gone wrong.'
                            );
                        }

                        renderer.removeClass(
                            element!.nativeElement,
                            classes.container
                        );
                    }
                );
            }
        );
    }
}

interface AnimationPlayerWrapper {
    player: AnimationPlayer;
    done: boolean;
}
