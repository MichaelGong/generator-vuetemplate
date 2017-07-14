'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    // 初始化
    initializing() {
        this.log(yosay( // 在yo图片右边的框中展示的信息
            'Welcome to the ' + chalk.red('vueBoilerplate') + ' Generator!'
        ));
    }
    // 用户输入
    prompting() {
        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: '项目名称：',
                default: ''
            },
            {
                type: 'input',
                name: '项目描述：',
                message: 'description',
                default: ''
            },
            {
                type: 'input',
                name: '项目版本：',
                message: 'version',
                default: '0.0.1'
            },
            {
                type: 'input',
                name: 'keywords',
                message: '项目关键词 (逗号分隔)',
                default: 'vue.js,vuex'
            },
            {
                type: 'input',
                name: 'author',
                message: '作者名称：',
                default: ''
            },
            {
                type: 'input',
                name: 'repository',
                message: 'Git地址：',
                default: ''
            },
            {
                type: 'input',
                name: 'license',
                message: 'License',
                default: 'MIT'
            }
        ];
        return this.prompt(prompts).then(props => {
            this.props = props;
        });
    }
    // 写入的时候
    writing() {
        this.log('Writing...\n');
        this._writingGitignore();
        this._writingPackageJSON();
        this._writingREADME();
        this._writingBabelrc();
        this._writingPostcssrc();
        this._writingFavicon();
        this._writingWebpackConfig();
        this._writingIndextpl();
        this._writingSrc();
    }
    // gitignore
    _writingGitignore() {
        this.fs.copyTpl(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore')
        );
    }
    // package.json
    _writingPackageJSON() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            {
                name: this.props.name,
                description: this.props.description,
                version: this.props.version,
                keywords: this.props.keywords.split(","),
                author: this.props.author,
                repository: this.props.repository,
                license: this.props.license
            }
        );
    }
    // readme
    _writingREADME() {
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                name: this.props.name,
                description: this.props.description
            }
        );
    }
    // babelrc
    _writingBabelrc() {
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
        );
    }
    // postcssrc.js
    _writingPostcssrc() {
        this.fs.copyTpl(
            this.templatePath('.postcssrc.js'),
            this.destinationPath('.postcssrc.js')
        )
    }
    // favicon.ico
    _writingFavicon() {
        this.fs.copy(
            this.templatePath('favicon.ico'),
            this.destinationPath('favicon.ico')
        )
    }
    // webpackConfig
    _writingWebpackConfig() {
        this.fs.copy(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        )
    }
    // index.tpl
    _writingIndextpl() {
        this.fs.copyTpl(
            this.templatePath('index.tpl'),
            this.destinationPath('index.tpl'),
            {
                title: this.props.name,
                description: this.props.description
            }
        );
    }
    // src
    _writingSrc() {
        this.fs.copy(
            this.templatePath('src/**'),
            this.destinationPath('src/')
        );
    }
    install() {
        this.log('\n正在安装依赖...');
        this.installDependencies({bower: false});
        // var done = this.async();
        // this.spawnCommand('cd '+ this.props.name, [])
        //     .on('exit', function (code) {
        //         if (code) {
        //             done(new Error('code:' + code));
        //         } else {
        //             done();
        //         }
        //     })
        //     .on('error', done);
    }

    default() {
        if (path.basename(this.destinationPath()) !== this.props.name) {
            this.log(
                '\n将自动创建' + this.props.name + '文件夹\n'
            );
            mkdirp(this.props.name);
            this.destinationRoot(this.destinationPath(this.props.name));
        }
    }
    end() {
        
    }
}