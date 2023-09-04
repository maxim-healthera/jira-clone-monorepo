
db = db.getSiblingDB('jira-clone');

db.createUser({
  user: 'root',
  pwd: 'root',
  roles: ['dbOwner'],
});
