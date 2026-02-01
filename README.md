# standup-tracker
Tool for managing task-lists as reported in daily developer stand-ups

TODO: format this README corretly


To Document
Modify .env file for database username/password

To run app (put all of these commands in build script in docker)
- docker compose up -d
- npx prisma generate
- npx prisma db seed

Include a short README explaining:
The domain and data model you chose.
How to run the project locally (Docker preferred).
The roles you implemented and their permissions.
Any trade-offs or improvements you’d make with more time.

Trade-offs
only letting users update entire task list
- a lot of data over the wire but simplifies updating associations between tasks and task lists upon remove
  since we're not allowing user to create task lists
