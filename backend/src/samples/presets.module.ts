import { Module } from '@nestjs/common';
import { PresetsController } from './presets.controller';
import { PresetsService } from './presets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Preset, PresetSchema } from './presets.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Preset.name, schema: PresetSchema }])],
  controllers: [PresetsController],
  providers: [PresetsService],
})
export class PresetsModule {}