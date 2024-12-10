export class QuizError extends Error {
  constructor(
    public override message: string,
    public type: 'DATA_LOAD' | 'VALIDATION' |'ICON_LOAD' | 'STATE' = 'DATA_LOAD'
  ) {
    super(message);
    this.name = 'QuizError';
  }
}

export class QuizErrorHandler {
  static handleError(error: unknown): void {
    if (error instanceof QuizError) {
      console.error(`[${error.type} Error]`, error.message);
    } else if (error instanceof Error) {
      console.error('[Unexpected Error]', error.message);
    } else {
      console.error('[Unknown Error]', error);
    }
  }
}