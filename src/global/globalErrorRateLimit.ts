import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    response.status(429).json({
      statusCode: 429,
      message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 30 giây.',
      retryAfter: 30
    });
  }
}