import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase // System Under Test

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion({}, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(question)

    const { questionComment } = await sut.execute({
      authorId: 'author-1',
      content: 'Test comment',
      questionId: 'question-1',
    })

    expect(questionComment.id).toBeTruthy()
    expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(
      questionComment.id,
    )
    expect(questionComment.content).toEqual('Test comment')
  })

  it('should not be able to create a question comment from an incorrect question id', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityID('question-1')),
    )

    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        content: 'Test comment',
        questionId: 'question-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
