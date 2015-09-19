module.exports = function(grunt) {
  var gruntInit = {};

  /**
   * Project settings
   */
  gruntInit.pkg = grunt.file.readJSON('package.json');


  /**
   * Testing
   */
  grunt.registerTask('test', ['karma']);

  grunt.loadNpmTasks('grunt-karma');
  gruntInit.karma = {
    unit: {
      configFile: 'karma.conf.js',
      background: false
    }
  };


  /**
   * Tasks
   */
  grunt.registerTask('default', ['test']);

  grunt.initConfig(gruntInit);
};
