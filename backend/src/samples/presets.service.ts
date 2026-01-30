import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preset } from './presets.schema';
import { initialPresets } from './initial-presets';

@Injectable()
export class PresetsService {
  constructor(@InjectModel(Preset.name) private presetModel: Model<Preset>) {}

  async getAllPresets(): Promise<Preset[]> {
    return this.presetModel.find().exec();
  }

  async getPresetById(id: string): Promise<Preset | null> {
    return this.presetModel.findById(id).exec();
  }

  async renamePreset(id: string, newPresetName: string): Promise<Preset | null> {
    return this.presetModel.findByIdAndUpdate(
      id,
      { category: newPresetName },
      { new: true },
    ).exec();
  }

  async deletePreset(id: string): Promise<boolean> {
    const result = await this.presetModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async restore() { // pour les tests
    await this.presetModel.deleteMany({});
    return await this.presetModel.insertMany(initialPresets);
  }
}