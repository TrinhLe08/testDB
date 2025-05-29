import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity() 
export class BookGragQLPostgresQLEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column() 
  title: string;

  @Field()
  @Column()
  author: string;

  @Field({ nullable: true })
  @Column({ nullable: true }) 
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}