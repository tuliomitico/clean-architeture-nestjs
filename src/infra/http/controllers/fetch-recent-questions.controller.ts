import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidatioPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidatioPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHttp) }
  }
}
