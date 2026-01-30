import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Sample extends Document {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

export const SampleSchema = SchemaFactory.createForClass(Sample);