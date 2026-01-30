import { Controller, Get, Param } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { Sample } from './sample.schema';

@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Get()
  async getAllSamples(): Promise<Sample[]> {
    return await this.samplesService.getAllSamples();
  }

  @Get('presets')
  async getPresets() {
    return await this.samplesService.getPresets();
  }

  @Get(':id')
  async getSampleById(@Param('id') id: string): Promise<Sample | null> {
    return await this.samplesService.getSampleById(id);
  }
}