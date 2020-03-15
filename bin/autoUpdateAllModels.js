var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));

const datasource = app.datasources.mysql;

const autoUpdate = async () => {
  await datasource.autoupdate();
};


autoUpdate()
  .then(result => {
    console.log('Auto update completed!');

    process.exit();
  })
  .catch(e => {
    {
      console.log(e)
      console.log('Auto update failed!');
      process.exit();
    }
  });
