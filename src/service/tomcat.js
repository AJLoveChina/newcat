const inquirer = require("inquirer");
const config = require("../data/config.js");
const fs = require("fs");
const path = require("path");
const unzip = require("unzip");
let osVersion = require('os').arch();

module.exports = {
    replaceServerXML(params) {
        let tomcatFileName = config.versionList.filter(item => item.k === params.version)[0].v;
        let resultPath = path.resolve(params.cwd, `${tomcatFileName}-${params.http}`);
        let serverXMLSourcePath = path.resolve(__dirname, "../data/server.xml");
        let serverXMLFinalPath = path.resolve(resultPath, tomcatFileName.replace(/\.zip$/, ""), "conf/server.xml");

        let xmlData = fs.readFileSync(serverXMLSourcePath);
        xmlData = xmlData.toString();

        for (let k in params) {
            let reg = new RegExp(`{{${k}}}`, 'gi');
            xmlData = xmlData.replace(reg, params[k]);
        }

        fs.writeFileSync(serverXMLFinalPath, xmlData);
    },
    unzip(params) {
        let tomcatFileName = config.versionList.filter(item => item.k === params.version)[0].v;
        let tomcatPath;
        if (osVersion === "x64") {
            tomcatPath = path.resolve(__dirname, "../../zip/64", tomcatFileName);
        } else {
            tomcatPath = path.resolve(__dirname, "../../zip/32", tomcatFileName);
        }

        let resultPath = path.resolve(params.cwd, `${tomcatFileName}-${params.http}`);

        return new Promise((s, r) => {
            fs.createReadStream(tomcatPath).pipe(unzip.Extract({ path: resultPath }))
                .on("finish", () => {
                    s(true);
                })
        })
    },
    config: {
        query () {
            let data = [{
                type: "list",
                message: "请选择Tomcat版本",
                name: "version",
                choices: config.versionList.map(item => item.k)
            }, {
                type: "input",
                message: "请输入HTTP端口号",
                name: 'http',
                default: "8080"
            }, {
                type: "input",
                message: "请输入shutdown端口号",
                name: 'shutdown',
                default: "8005"
            }, {
                type: "input",
                message: "请输入AJP端口号",
                name: 'ajp',
                default: "8009"
            }];

            return inquirer.prompt(data)
        }
    }
};