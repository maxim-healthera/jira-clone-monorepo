import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VerificationEmailDocument = HydratedDocument<VerificationEmail>;

@Schema({ collection: 'verification-emails' })
export class VerificationEmail {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  first_name: string;
}

export const VerificationEmailSchema = SchemaFactory.createForClass(VerificationEmail);
