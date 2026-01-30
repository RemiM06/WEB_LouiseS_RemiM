import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sample } from './sample.schema';

@Injectable()
export class SamplesService {
  constructor(@InjectModel(Sample.name) private sampleModel: Model<Sample>) {}

  async getAllSamples(): Promise<Sample[]> {
    return this.sampleModel.find().exec();
  }

  async getSampleById(id: string): Promise<Sample | null> {
    return this.sampleModel.findById(id).exec();
  }

  async getPresets() {
    const allSamples = await this.getAllSamples();
    
    return [
      { 
        id: 1,
        name: "Full Drum Kit", 
        samples: allSamples 
      },
      { 
        id: 2,
        name: "Drums Only", 
        samples: allSamples.filter(s => s.category === "drum") 
      },
      { 
        id: 3,
        name: "Cymbals Only", 
        samples: allSamples.filter(s => s.category === "cymbal") 
      },
    ];
  }
}