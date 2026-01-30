import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Sample } from './sample.schema';

@Schema()
export class Preset extends Document {
  @Prop({ required: true })
  category: string;

  @Prop([Sample])
  samples: Sample[];
}

export const PresetSchema = SchemaFactory.createForClass(Preset);