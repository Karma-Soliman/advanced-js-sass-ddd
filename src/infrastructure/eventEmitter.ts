import { DomainEvent, Observer } from "./events";

export class EventEmitter {
    private observers: Observer[] = []

    subscribe(observer: Observer): void {
        this.observers.push(observer)
    }
    
    unsubscribe(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer)
    }

    emit(event: DomainEvent): void {
        this.observers.forEach(o=> o(event))
    }
}