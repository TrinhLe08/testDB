import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
    
@Entity()
export class UserPostgresQLEnity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
