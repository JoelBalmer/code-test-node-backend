# Roombooker
Welcome to RoomBooker - A simple API to view room bookings!

# Instructions
1. Head to [ocasta-room-booker.herokuapp.com](https://ocasta-room-booker.herokuapp.com/) the following URL where and you can make your requests
2. For info on how URLs are formatted, what headers are needed, etc., head to [challenge.ocasta.com](http://challenge.ocasta.com/)

# Recent projects
### Change document text colour
* _Why_ - bourne out of necessity to change the text colour on all slides in a Google Sheet presentation. A few google searches told me this tool didn't exist (but was needed by others), so I built it and released it to the world! Also interesting to go through the chrome store process
* _Github_ - [change-document-text-color](https://github.com/JoelBalmer/change-document-text-color)
* _Live site_ - [Chrome store link](https://chrome.google.com/webstore/detail/change-document-text-colo/kionkfamcijghpmkechfjddheiencdpm)

# Checklist
1. Move error messages from after callbacks to before callbacks, using err in mongodb function callbacks, like the availability one
2. Refactor to separate route files, etc.
https://github.com/expressjs/express/blob/master/examples/route-separation/index.js#L29
3. Be consistent with erroring (passing up the chainn, res.send, etc.)
4. Be consistent with spacing
5. Be consistent with commenting
6. Add entry to the usage collection each time a room is a) created b) availabilty updated c) name updated
7. ~~Security points by obscuring mongodb admin info~~
8. ~~Add optional room id to usage~~
9. ~~Add air bnb style jsvscript guide~~

# Improvements
1. Move users to a database instead of a JSON list
2. Use JSON web tokens to use production grade authentication security
3. Use a slightly different method to remove deprecated warning: https://able.bio/ivanberdichevsky/how-to-set-up-a-mongodb-environment-along-with-npm--18gkgzt
4. Report back to 'user' that they can't update room name AND they have succesfully updated availability