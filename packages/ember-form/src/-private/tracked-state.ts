import { tracked } from '@glimmer/tracking';

/**
 * Holds a single reactive value. Reads of `.current` are autotracked, so
 * templates and `cached` getters that read it will recompute when it changes.
 */
export class TrackedValue<T> {
  @tracked current: T;

  constructor(initial: T) {
    this.current = initial;
  }
}
