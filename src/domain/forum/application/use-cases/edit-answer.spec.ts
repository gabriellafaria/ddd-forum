import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toValue(),
      content: 'New test content',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'New test content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        authorId: 'author-2',
        answerId: newAnswer.id.toValue(),
        content: 'New test content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
