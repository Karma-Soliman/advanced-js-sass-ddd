type EventHandler<T> = (event: T) => void

export class EventEmitter {
  private observers: {
    [key: string]: EventHandler<any>[]
  } = {}

  subscribe<T>(eventType: string, handler: EventHandler<T>): void {
    if (!this.observers[eventType]) {
      this.observers[eventType] = []
    }
    this.observers[eventType].push(handler)
  }

  unsubscribe<T>(eventType: string, handler: EventHandler<T>): void {
    if (!this.observers[eventType]) return

    this.observers[eventType] = this.observers[eventType].filter(
      h => h !== handler
    )
  }

  emit<T>(eventType: string, payload: T): void {
    if (!this.observers[eventType]) return

    this.observers[eventType].forEach(handler => handler(payload))
  }
}