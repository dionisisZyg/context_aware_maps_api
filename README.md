# CTX Maps

# Initial Setup
In order to get the application up and running in your local enviroment you must do the following:

*  Install the npm packages
*  Have A mysql server running 
*  Have a database named **ctxmaps** with collation: utf_8_general_ci
*  set up the enviroment variables, for security reasons accordingly (for more info, the json config file for the database setup is under the root folder: ./server/datasources.json):
    *  **MYSQL_HOST** : the host of the mysql server
    *  **MYSQL_PORT** : the port that the server is running
    *  **MYSQL_USER** : the username of the server
    *  **MYSQL_PASSWORD** : the username of the server
*  once the the database is set, we can migrate the database schemas from our entities. In order to do so we must run the following node script in the root folder: **node bin/autoUpdateAllModels**.
*  After successfull execution of the script, we can finally run the eb api with **node .**
*  The endpoints of the api are available to explore at: host:port/explorer, where host is localhost for local and port 3000. The above configurations can be found at ./server/config.json

# Notes
The endpoints are locked for unathenticated users. Only the endpoint for user creation is available: /api/people POST. So in order to test the endpoints you must:

*  Create a user at /people POST using username, email, password
*  Login with the credentials username or email and password at /people/login
*  The login response with contain the auth token in the property id. Set it at the input of the explorer at the top right of the screen
*  Test the endpoints
