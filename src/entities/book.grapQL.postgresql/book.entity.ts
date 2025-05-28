import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity() // 👈 Thêm decorator TypeORM
export class BookGragQLPostgresQLEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid') // 👈 Khai báo primary key
  id: string;

  @Field()
  @Column() // 👈 Ánh xạ vào cột database
  title: string;

  @Field()
  @Column()
  author: string;

  @Field({ nullable: true })
  @Column({ nullable: true }) // 👈 Cho phép NULL trong database
  description?: string;

  @Field()
  @CreateDateColumn() // 👈 Tự động tạo timestamp
  createdAt: Date;
}