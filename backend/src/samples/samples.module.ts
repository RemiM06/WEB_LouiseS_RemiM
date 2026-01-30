import { Module } from '@nestjs/common';
import { SamplesController } from './samples.controller';
import { SamplesService } from './samples.service';
import { Sample, SampleSchema } from './sample.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }])],
  controllers: [SamplesController],
  providers: [SamplesService],
})
export class SamplesModule {}