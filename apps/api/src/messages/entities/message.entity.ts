import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
