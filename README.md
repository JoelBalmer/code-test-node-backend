# Roombooker
Welcome to RoomBooker - A simple API to view room bookings!

# Instructions
1. Head to [ocasta-room-booker.herokuapp.com](https://ocasta-room-booker.herokuapp.com/) the following URL where and you can make your requests
2. For info on how URLs are formatted, what headers are needed, etc., head to [challenge.ocasta.com](http://challenge.ocasta.com/)
3. List of users were not committed for security, see email for list of users
4. Hit the appropriate api endpoint with valid request headers (and body data if required) and you should see returned the appropriate data and response codes (or error code and message).

# Technical choices
##### Compromises
1. Express mLab and Heroku were used because I have worked with them before and they fufill the requirement. I chose to use MongoDB and not mongoose (despite only knowing mongoose) as mongodb was specifically mentioned in the spec, but mongoose wasn't.
2. Architecturally, I began by building all routes and db calls in the same file. Then once I'd tested it was working, I began modularising, simplifying, building utility modules, etc. This had the added benefit of increasing elegance, helping with DRY issues, testing, security, etc.
3. A trade off I made was that I wanted to use a new collection in mongo for users. This would have been more 'real world' but it would have been extra work, whereas a pre-canned list of users met the brief. I also have no experience with Dockerfiles (as mentioned before), and even though it was recommended, I interpreted the brief to mean ideally i.e. preferred was having a public location to test against, which I have provided.

##### Suggested improvements
1. Move users to a database instead of a JSON list
2. Use JSON web tokens to use production grade authentication security
3. Produce a more extensive testing suite (such as spoofing data, testing what shouldn't be returned)
4. Have error callback for database queries (currently it only logs rather than sends error feedback up the chain)
5. Use a slightly different method to remove mongodb deprecated warning: https://able.bio/ivanberdichevsky/how-to-set-up-a-mongodb-environment-along-with-npm--18gkgzt

##### Checklist
1. ~~Move error messages from after callbacks to before callbacks, using err in mongodb function callbacks, like the availability one~~
2. ~~Refactor to separate route files, etc.~~
3. ~~Be consistent with erroring (passing up the chainn, res.send, etc.)~~
4. ~~Be consistent with spacing~~
5. ~~Be consistent with commenting~~
6. ~~Add entry to the usage collection each time a room is a) created b) availabilty updated c) name updated~~
7. ~~Security points by obscuring mongodb admin info~~
8. ~~Add optional room id to usage~~
9. ~~Add air bnb style jsvscript guide~~
10. ~~Modularise adding usage~~
11. ~~Make users JSON list in config~~
12. ~~Truncate name~~
13. ~~Report back to 'user' that they can't update room name AND they have succesfully updated availability~~
14. Remove return line from routes (if error)
15. Move truncation to db query files

# Recent projects
For many more projects, head to [github.com/JoelBalmer](https://github.com/JoelBalmer)

##### Change document text colour
* _Why_ - bourne out of necessity to change the text colour on all slides in a Google Sheet presentation. A few google searches told me this tool didn't exist (but was needed by others), so I built it and released it to the world! Also interesting to go through the chrome store process
* _Github_ - [change-document-text-color](https://github.com/JoelBalmer/change-document-text-color)
* _Live site_ - [Chrome store link](https://chrome.google.com/webstore/detail/change-document-text-colo/kionkfamcijghpmkechfjddheiencdpm)

##### Sleep Diary
* _Why_ - I attended a sleep course and saw a need for a tool to calculate sleep efficiency. In the process I have learnt ReactJS, and honed my NodeJS and express skills
* _Github_ - [sleep-diary](https://github.com/JoelBalmer/sleep-diary)
* _Live site_ - Working prototype of [Sleep diary](https://sleep-diary-app.herokuapp.com/) (with my real live data that I use as a sleep diary)

##### Other NodeJS projects
* _Why_ - OpenDeck was my first glimpse into the world of NodeJS - I built it as way to communicate between web and native Android in real-time via websockets. I then used BeerBros as a way to learn basic CRUD/REST principles and implementation.
* _Github_ - [BeerBros](https://github.com/JoelBalmer/BeerBros) (OpenDeck is a private repository)
* _Live site_ - BeerBros is only available by cloning the repository and running locally (please contact me if you would like to discuss OpenDeck further)

##### Personal sites
* _Why_ - I enjoy experimenting with new ideas and javascript libraries, which also serves as a way to demonstrate my abilities
* _Github_ - [joelbalmer]() is my personal site and [joelbalmermusic](https://github.com/joelbalmermusic/joelbalmermusic) is my freelance composing showreel website
* _Live site_ - [Joel Balmer](https://www.joelbalmer.life/) and [Joel Balmer Music](http://www.joelbalmermusic.co.uk/)

##### Public contributions/pull requests
* _Why_ - I like getting more experience and contributing to projects I use and that are open source
* _Github_ - [gas-github](https://github.com/JoelBalmer/gas-github) and [darkreader](https://github.com/JoelBalmer/darkreader) are ones I've contributed to
* _Live site_ - Chrome store links for [Google Apps Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo) and [Dark Reader](https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh)