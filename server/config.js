module.exports =
{
    'secret':   'questa_e_la_mia_chiave',
    'database': 'mongodb://localhost:27017/jwt_tutorial_db',
    'log-dir' : 'log',
    'ambiente-log':'debug', /* { error:0, warn:1, info:2, verbose:3, debug:4, silly:5 } */
    'default-admin-name':   'admin',
    'default-admin-psw':    "admin",
    mode:'dev', //dev or production
    jwtSecret: "A1sd3nh5dr7",
    jwtSession: {
        session: false
    },
    timeSessionToken: 1,//espresso in ore
    cookieAge: 1000 * 60 * 60 * 24 * 7,//ultimo numero sono i giorni
    timeCallMethodPeriodically:"00 42 17 * * 0-6"/* Runs every weekday (Sunday through Saturday) at 22:15:00 AM. It does not run on Saturday or Sunday. */
};
