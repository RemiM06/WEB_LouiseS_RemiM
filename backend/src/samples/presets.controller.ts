import { Controller, Get, Param, Patch, Body, Delete, Post } from '@nestjs/common';
import { PresetsService } from './presets.service';
import { Preset } from './preset.schema';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Get()
  async getAllPresets(): Promise<Preset[]> {
    return await this.presetsService.getAllPresets();
  }

  @Get(':id')
  async getPresetById(@Param('id') id: string): Promise<Preset | null> {
    return await this.presetsService.getPresetById(id);
  }

  @Patch(':id/rename')
  async renamePreset(@Param('id') id: string, @Body('newPresetName') newPresetName: string): Promise<Preset | null> {
    return await this.presetsService.renamePreset(id, newPresetName);
  }

  @Delete(':id')
  async deletePreset(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const result = await this.presetsService.deletePreset(id);
    return { deleted: result };
  }

  @Post('restore')
  async restore() {
    return await this.presetsService.restore();
  }

  @Post()
  async createPreset(@Body() presetData: Preset): Promise<Preset> {
    return await this.presetsService.createPreset(presetData);
  }
}