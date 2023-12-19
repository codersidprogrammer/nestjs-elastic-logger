# NestJS Logging Module

This module will do some intercept on your request. Then it will record the request into elasticsearch

## Installation

This package use some dependencies. Download all codes in this repository. Place it in `src` folder as you need

### Elasticsearch

```bash
yarn add @nestjs/elasticsearch @elastic/elasticsearch
```

### Event Emitter Module
```bash
yarn add @nestjs/event-emitter
```
for further information visit 
[Documentation](https://docs.nestjs.com/techniques/events)

## Usage
If you have no any event emitter dependencies before, just place this code on  `AppModule` class in `imports` 
But, if you do, just skip this step.

``` typescript
[
  ...
  EventEmitterModule.forRoot({
      maxListeners: 200, // Change this based on your needs
      delimiter: '.',
      wildcard: true,
  }),
]
```

Place this module on `AppModule` class in `imports` section. Use dash sign `-` if there were space needs in index name.

```typescript
[
...
   LogModule.forRoot({
      logHost: 'http://localhost:9200', // host of elasticsearch
      logIndex: {
        debug: 'test-xops-debug', // index name for debug
        info: 'test-xops-info', // index name for info
        default: 'test-xops', // index name for default
        error: 'test-xops-error', // index name for error
      },
    }),
]
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Youtube

[Coders Indonesia](https://www.youtube.com/codersindonesia)
