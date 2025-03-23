import { Controller, Delete, Post } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) { }

  @Post()
  async createSampleData() {
    await this.sampleService.createSampleData();
    return { message: 'Sample data created successfully' };
  }

  @Delete("clearDB")
  async clearDB() {
    return await this.sampleService.clearDB()
  }
}
