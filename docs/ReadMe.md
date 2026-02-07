# Leave Planner

Ever wanted to know how much leave you'll have in the future and easily visualise your balance over time? Sure, some leave systems have some kind of future leave calculator, but none that I've seen make it easy or intuitive.

## The spreadsheet prototype

To scratch my own itch, I started with a google sheet. The principle is simple: Enter your starting balance, and for each month fill in the estimated hours leave accrued. Add in your hours leave taken for the month... and graph the total leave remaining.

Here's the end result:

![Annual leave.png](Annual leave.png)

It's very simple to use:

- Adjust dates
- Enter your starting balance
- Enter the actual hours leave accrued for each month in the past
  - For future months enter an estimate
- Enter your hours leave taken in the past or booked for the future

Your leave balance is calculated and projected into the future based on what you've entered. The graph lets you easily see when you are approaching zero!

![Annual leave annotated.png](Annual leave annotated.png)

Here's a link to the template - you can make a copy and then fill it in for yourself: [Leave Planner Template](https://docs.google.com/spreadsheets/d/1Ro2LpwpK-mnRq_xpYEs2IJD8CYNKcZafyVZ9Ch9ZTJI/edit?usp=sharing)

## The web application

Now that the concept has proven useful to me, it's time to turn it into a web application for convenient use...

Main view:
![leave planner - main.png](leave%20planner%20-%20main.png "Main View")

Enter leave:
![leave planner - enter leave.png](leave%20planner%20-%20enter%20leave.png)

Settings:
![leave planner - settings.png](leave%20planner%20-%20settings.png)

About:
![leave planner - about.png](leave%20planner%20-%20about.png)

Available here, on github pages: https://prule.github.io/leave-planner/
