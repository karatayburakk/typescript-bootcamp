import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Lesson } from './lesson';

@Entity({ name: 'COURSES' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seqNo: number;

  @Column()
  title: string;

  @Column()
  iconURL: string;

  @Column()
  longDescription: string;

  @Column()
  category: string;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lesssons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;
}
