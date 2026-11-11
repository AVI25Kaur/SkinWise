# Kira Blog

The app uses PostgreSQL through the `pg` package. Set `DATABASE_URL` in the
environment (or in a local `.env` file) to a PostgreSQL connection string before
starting the server:

```text
DATABASE_URL=postgresql://username:password@localhost:5432/kira_blog
SESSION_SECRET=replace-with-a-long-random-value
```

The database itself must already exist. On startup, the app creates the tables
and indexes defined in `db/schema.sql` if they do not exist. Set
`PGSSLMODE=require` for a remote database that requires TLS. Existing MongoDB
records are not copied automatically; migrate or import them before switching
production traffic to PostgreSQL.
