var path = require('path');

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			main: {
				options: {
					port: 1000,
					keepalive: true,
					base: 'app'
				}
			}
		},

		jshint: {
			main: [
				'Gruntfile.js',
				'src/js/**/*.js'
			]
		},

		clean: {
			main: ['app'],
			all: ['app', '.sass-cache']
		},

		compass: {
			main: {
				options: {
					outputStyle: 'expanded',
					sassDir: 'src/styles',
					cssDir: 'app/css',
					environment: 'production'
				}
			}
		},

		jade: {
			main: {
				expand: true,
				cwd: 'src/html',
				src: ['**/*.jade'],
				dest: 'app',
				ext: '.html'
			},
			templates: {
				files: {
					'app/js/templates.js': 'src/templates/**/*.jade'
				},
				options: {
					amd: true,
					client: true,
					processName: function (name) {
						return path.basename(name, '.jade');
					}
				}
			}
		},

		copy: {
			main: {
				expand: true,
				cwd: 'src/js',
				src: ['**/*.js'],
				dest: 'app/js'
			},
			lib: {
				expand: true,
				cwd: 'lib',
				src: ['**'],
				dest: 'app/lib'
			}
		},

		watch: {
			css: {
				files: ['src/styles/**/*.scss'],
				tasks: ['compass:main']
			},
			html: {
				files: ['src/html/**/*.jade'],
				tasks: ['jade:main']
			},
			templates: {
				files: ['src/templates/**/*.jade'],
				tasks: ['jade:templates']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['copy:main']
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true,
				limit: 10
			},
			build: {
				tasks: ['compass:main', 'jade:main', 'jade:templates', 'copy:main', 'copy:lib']
			},
			watch: {
				tasks: ['watch:css', 'watch:html', 'watch:templates', 'watch:js']
			},
			run: {
				tasks: ['concurrent:watch', 'connect:main']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('test', 'jshint');
	grunt.registerTask('default', ['clean:main', 'concurrent:build', 'concurrent:run']);
	grunt.registerTask('cleanAll', 'clean:all');
}
