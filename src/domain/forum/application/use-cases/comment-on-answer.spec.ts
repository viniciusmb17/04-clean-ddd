import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase // System Under Test

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(answer)

    const { answerComment } = await sut.execute({
      authorId: 'author-1',
      content: 'Test comment',
      answerId: 'answer-1',
    })

    expect(answerComment.id).toBeTruthy()
    expect(inMemoryAnswerCommentsRepository.items[0].id).toEqual(
      answerComment.id,
    )
    expect(answerComment.content).toEqual('Test comment')
  })

  it('should not be able to create a answer comment from an incorrect answer id', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({}, new UniqueEntityID('answer-1')),
    )

    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        content: 'Test comment',
        answerId: 'answer-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
