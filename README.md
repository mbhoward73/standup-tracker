# standup-tracker
Stand-up Tracker is a tool for developers to keep track of what they work on every day to make it easier for them for reporting during daily stand-ups.  It also allows managers the ability to view the daily tasks for their teams.

## How to run

- docker compose up --build
- Open browser and navigate to http://localhost:3000
- Login as one of the seeded users
  - Josh Wilson
    - login: jwilson@breachrx.com
    - password: josh
    - role: DEVELOPER
    - team: Angular Devs
  - Steve Ridzik
    - login: sridzik@breachrx.com
    - password: steve
    - role: DEVELOPER
    - team: Angular Devs
  - Matt Hartley
    - login: mhartley@breachrx.com
    - password: matt
    - role: MANAGER
    - team: Angular Devs
  - Andy Lunsford
    - login: alunsford@breachrx.com
    - password: andy
    - role: COMPANY_ADMIN
    - team: Company Admins

## Data Model

- Company
  - All data is scoped by company so different companies can use the system with segregated data
- User
  - A user in the system with a particular role
  - Affiliated with a particular company
  - Affiliated with a particular team
- Team
  - A development team which consists of a list of users
    - One of these users will be a MANAGER and the rest of the users will be DEVELOPERS
- Task List
  - A list of tasks for a particular developer on a particular calendar work day
- Task
  - A development task which contains various data describing the task and its status
    - The task is always affiliated with a particular task list for a particular day
    - Private flag allows developer to make the task visible only to them and NOT to their manager
    - Hours estimate is a field only visible to the owner of the task
- Audit Log
  - This tracks all graphql operations invoked on server

## Roles

- ADMIN
  - Can do anything in the entire system
- COMPANY_ADMIN
  - Can do anything on any resource scoped to the particular company the user is affiliated with
- MANAGER
  - Can update the team resource for the team they belong to
  - Full control and visibility over their own task lists and tasks
  - Can view the task lists and tasks of the developers on their team
    - Can NOT view any tasks that the developers have marked as private
    - Can NOT view the hoursEstimate field on the developer tasks
- DEVELOPER
  - Full control and visibility over their own task lists and tasks
  - Can NOT view any other task lists or tasks

## Trade-offs

- automatically creating an empty task list for a particular user and day any time that task list is queried
  - this is clearly wonky but it simplifies the implementation and obviates the need to manage task list creation
- duplicated abilities file on client
  - just a short-cut due to time constraints but client needs to fetch these permissions from server upon login
- checked in secrets to github
  - obviously wrong but I'm just trying to remove any extra steps needed to bring up the app
  - also hard-coded db_password in docker compose
- using HTTP instead of HTTPS
  - obviously not great when logging in and sending plain text password to server
- data model has various unnecessary relations
  - this sped up development since it made it easier to just assume that the given field was present when needed (eg. ability check for companyId on all resources) but this can be cleaned up
- various operations use arguments from context instead of supporting passed in arguments to operation
  - eg. auditLog takes no arguments and just returns the audit log for the company which the calling user is affiliated with
  - this cuts down on argument bloat in the various operations but might need to be revisited when we add support for ADMIN user who will need the ability to make different queries for different companies
- tests can only be run after a db seed
  - just a shortcut

## TODO

### I was hoping to get to these but ran out of time

- Write front-end automated tests with Playwright, Cypress or WebdriverIO
- Add graphql variables to audit logging
- Fix race condition when creating task lists during query
- Clean up task list dashboard UI and make pretty
  - Something more similar to Trello where columns are a little separate, tasks appear more like cards and data is more compact
  - Ideally developers and managers should be able to view a bunch of data at a glance without so much scrolling
- Client should fetch abilities from server upon login
- Set up HTTPS
- Use auth directives in graphql schema
- add created/lastModified/modifiedBy fields for all tables in database
- revisit unnecessary relations on all tables
  -  also look at relation return blocks in prisma queries
- add dataloader to graphql on the server side to ensure that we only fetch a given resource once for a particular request
- configure Apollo in-memory cache on client side
- configure eslint
- switch to vite bundler and set up client dist build
- implement a color theme in webapp
- add some icons (eg. trash can for delete buttons, nav bar items)
- shorten JWT token expiration time and set up refresh tokens
- each test should start with clean database, build up all of the data it needs to run the test, execute the test and then clean out the database
- add spinner on UI for all loading operations
- make UI responsive to all sizes


## Future Enhancements

### Who was I kidding really?

- authentication with verification codes as alternative to passwords
- highlight current day task list in UI
- ability to control order of tasks within each task list
  - currently we just sort by createdAt timestamp descending
- ability to move a task from one task list to another
- automatically copy over IN_PROGRESS tasks from yesterday when next day begins
- ability to navigate backwards and forwards across calendar days so you can view task lists other than just yesterday/today/tomorrow
- add NavBar with Home/Users/Team/Admin items
- give COMPANY_ADMIN users the ability to create/delete users for a company and change user role
- give MANAGER users the ability to add/remove members to their team and change team name
  - enforce only one manager per team
- reset password link on login page
- ADMIN user should be able to login and switch between companies and have full control over every company
- build UI that lets COMPANY_ADMIN users switch between teams to view task lists
- give COMPANY_ADMIN users the ability to add/remove teams
- Managers should be notified somehow when one of their team members sets a task to status NEED_HELP or BLOCKED
- validate e-mail addresses when new user is added
- highlight task list in red if hoursEstimate for all tasks totals more than 8 hours for a given day
- Reporting dashboard with pie charts and metrics for manager
  - eg. Pie chart of current tasks by state for each developer











