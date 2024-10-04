# webpack-template

Webpack development template for use in other projects to have a head-start. Most of the code for setting up the webpack environment is same - this is taking advantage of that fact.

NPM scripts, prod, development, and other configs including ESLint is set-up. (Except Prettier, as it's much easier to make do with the VSCode extention instead)

Requirements: (from the documentation) - All dates and times are in local time of the location specified. Dates should be in the format yyyy-MM-dd. For example 2020-10-19 for October 19th, 2020 or 2017-02-03 for February 3rd, 2017.

1 - In other words, our first requirement is that we need the date-fns library that we used for WorkitKit
2 - Convert / request time based on user's current local time converted to X location
3 - Stick to Promises / Use Async Await
4 - JSON list of countries with capitals to fill/suggest in for the search-box for better UX/UI
5 - Promises.race([prX, setTimeoutIfPromiseDoesntReply]) - incase the data entered is wrong or there is an error in the function: use a setTimeout function to reject() and abort process.
6 - Garbage collect promises, use .finally()
