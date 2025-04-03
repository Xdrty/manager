import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest() {
    return {
      status: 'ok',
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    };
  }
} 