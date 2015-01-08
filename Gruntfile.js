var path = require('path');

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/*connect: {
			main: {
				options: {
					port: 1000,
					keepalive: true,
					base: 'app'
				}
			}
		},*/
		execute: {
			target: {
				src: ['main.js']
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
			all: ['app', '.sass-cache', 'socket.js', 'server.js', 'main.js']
		},

		less: {
			main: {
				options: {
					paths: ['src/styles'],
					compress: true
				},
				files: [
					{
						expand: true,
						cwd: 'src/styles',
						src: ['*.less'],
						dest: 'app/css/',
						ext: '.css'
					}
				]
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
			js: {
				expand: true,
				cwd: 'src/js',
				src: ['**/*.jade'],
				dest: 'app/js',
				ext: '.html'
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
				cwd: 'src/lib',
				src: ['**'],
				dest: 'app/lib'
			},
			server: {
				expand: true,
				cwd: 'src/server',
				src: ['**'],
				dest: './'
			},
			img: {
				expand: true,
				cwd: 'src/img',
				src: ['**'],
				dest: './app/img'
			}
		},

		watch: {
			css: {
				files: ['src/styles/**/*.less'],
				tasks: ['less:main']
			},
			html: {
				files: ['src/html/**/*.jade'],
				tasks: ['jade:main']
			},
			htmljs: {
				files: ['src/js/**/*.jade'],
				tasks: ['jade:js']
			},
			templates: {
				files: ['src/templates/**/*.jade'],
				tasks: ['jade:templates']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['copy:main']
			},
			serverJs: {
				files: ['src/server/**/*.js'],
				tasks: ['copy:server']
			},
			lib: {
				files: ['src/lib/**/*.js'],
				tasks: ['copy:lib']
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true,
				limit: 10
			},
			build: {
				tasks: ['less:main', 'jade:main', 'jade:js', 'copy:main', 'copy:lib', 'copy:server', 'copy:img']
			},
			watch: {
				tasks: ['watch:css', 'watch:html', 'watch:htmljs', 'watch:js', 'watch:lib', 'watch:serverJs']
			},
			run: {
				tasks: ['concurrent:watch', 'execute:target']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-execute');

	grunt.registerTask('test', 'jshint');
	grunt.registerTask('default', ['clean:main', 'concurrent:build', 'concurrent:run']);
	grunt.registerTask('cleanAll', 'clean:all');
	grunt.registerTask('build', 'concurrent:build');
	grunt.registerTask('heroku', 'concurrent:build');
};
