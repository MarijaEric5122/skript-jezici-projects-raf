import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Picture {
  @PrimaryGeneratedColumn("uuid")
  picture_id!: string;

  @Column()
  name!: string;

  @Column("text")
  picture_data!: string;

  @ManyToOne(() => User, (user) => user.pictures)
  author!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
