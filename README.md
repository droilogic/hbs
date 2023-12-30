# hbs
Hotel Booking System
- built upon MEAN stack

## environment requirements
- populate .env file with
-- DB_URL (url to mongoDB)
-- OWN_SALT (>=20 char salt used internally)

## DB requirements
- insert the following entries to "roles" collection
```
{"_id":{"$oid":"655c9b3e5f499d684d2079b8"},"descr":"administrators","acclvl":{"$numberInt":"0"},"rv":{"$numberInt":"0"}}
{"_id":{"$oid":"655c9bfc5f499d684d2079b9"},"descr":"users","acclvl":{"$numberInt":"100"},"rv":{"$numberInt":"0"}}
{"_id":{"$oid":"655c9c445f499d684d2079ba"},"descr":"guests","acclvl":{"$numberInt":"500"},"rv":{"$numberInt":"0"}}
```
- replace admin _id at auth.service.ts line 168 to prevent deletion of super admin!
