import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggrergateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggrergate // eslint-disable-line

  constructor(aggregate: CustomAggrergate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggrergate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggrergate(null)

    aggregate.addDomainEvent(new CustomAggrergateCreated(aggregate))

    return aggregate
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    DomainEvents.register(callbackSpy, CustomAggrergateCreated.name)

    const aggregate = CustomAggrergate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
