import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
    
@Entity()
export class UserPostgreSQLEntity  {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID tự động tăng', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'Tên người dùng', example: 'John Doe' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email: string;

  @Column()
  @ApiProperty({ 
  description: 'Mật khẩu (đã mã hóa)', 
  example: '$2a$10$xyz...', 
  writeOnly: true 
  })
  password: string;
}

