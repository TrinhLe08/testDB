import { UserPostgreSQLEntity } from 'src/entities/user.entity.postgresql';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

export function SwaggerGetAllUsers() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Lấy danh sách users',
      description: 'Trả về tất cả users (có phân trang và filter).',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Trang hiện tại (mặc định: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Số lượng items/trang (mặc định: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Danh sách users kèm metadata phân trang.',
      schema: {
        example: {
          data: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
            },
          ],
          meta: {
            totalItems: 2,
            currentPage: 1,
            itemsPerPage: 10,
          },
        },
      },
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Không tìm thấy users.' 
    }),
  );
}

export function SwaggerCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Tạo mới user' }),
    ApiBody({ type: UserPostgreSQLEntity }),
    ApiResponse({ 
      status: 200, 
      description: 'Trả về user đã tạo.',
      type: UserPostgreSQLEntity 
    }),
    ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  );
}

