module.exports = function(grunt) {
  grunt.registerTask('hello', function() {
    console.log('world');
  });

  grunt.registerTask('default', ['hello']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });
};
