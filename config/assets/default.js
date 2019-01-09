module.exports = {
  server: {
    gulpConfig: ['gulpfile.js'],
    all_js: ['index.js', 'config/**/*.js'],
    helpers: ['server/helpers/*.js'],
    models: ['server/models/*.js'],
    controllers: ['server/controllers/*.js'],
    routes: ['server/routes/*.js'],
    policies: ['server/policies/*.js'],
    validations: ['server/validations/*.js']
  }
};
