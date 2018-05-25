const tomcat = require("./src/service/tomcat.js");
let cwd = process.cwd();

module.exports = (async() => {
    let config = await tomcat.config.query();

    config.cwd = cwd;
    console.log(config);

    await tomcat.unzip(config);
    await tomcat.replaceServerXML(config);
});