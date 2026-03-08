import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'analytiq-sdk',
      version: '1.0.0',
      description:
        'Analytics platform API — track events, analyze funnels, measure retention.',
    },


    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',

        },
      },
    },
  },

  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
