# Naya-Challenge

Hi! Ignacio here, hope this challenge is up to your standars! Let me give you a quick rundown

## DISCLAIMER

For you to see the end result you must go to the Backend folder and simply run "npm run dev", the build version of the frontend will just run everything smoothly,
no need to run both things separately, I just added the front end in the un-build version so you can look at it.

## SECOND DISCLAIMER

I had an issue while literally uploading the repository to github, pushed some changes to a dummy repository so I could work on another device, so to be able to push it 
here had to make some changes, in the heat of the moment I lost all the progress up until the last commit, thank god I had already built the finished version, so the only
loss is that I have a days old code to show for the front end. Im currently writing this before submitting, so re-writing the code is not possible for the amount of time left.
Its a good thing that some of the things lost were some minor things, but I recall completely how I did them, so it wont be a problem to tell you exactly on the follow up meetings.

I hope you can understand this minor setback, again, as I said, the built version is all set and done, so nothing is missing there, just that you wont have legible code to see for 
the last features I added.

## NOW, THE THINGS DONE HERE

- Simple canvas - DONE
- User has to be logged in to acces the canvas - DONE
- Simple sign up and login - DONE
- Panel with users that interacted with the sketch - DONE
- Panel with other sketches on the database - DONE
- Ability to create new sketches - DONE
- REST API - DONE
- Ability to save sketches - DONE
- Live colaboration feature for multiple users - DONE
- Give each unique user a unique color - DONE
- Add a little extra and add a sketches preview page - DONE

### AND... HOW DID I MAKE THEM?

#### SIMPLE CANVAS

Simply used the default html canvas + a few functions and custom hook that I tweaked to fit into my needs, having functions like
clear the canvas, store the canvas current image using the .toDataURL method, and some more.

#### User has to be logged in to acces the canvas

Used a Protected Route from React Router to check if the user is loged, if not, redirect to the sign up page.

#### Simple sign up and login

Used the Firebase auth to create, store and check the users on both instances.

#### Panel with users that interacted with the sketch

Bassicaly made that any time a user goes into a sketch that has been saved in the database, I will look for that sketch,
get a parameter called "colaborators" which is a simple array of colaborators, check if the current user is in said array, and if not
just add it and update the new array.

-- This is one of the main losses on the big front end fiasco I told you before (again, I'm sorry) --

And I believe the "just make it work" code that I have up for display is not a fair representation of how I ended up doing things
Thank god I have a screenshot of how I ended up doing it
![image](https://user-images.githubusercontent.com/65029266/197916638-d7a80499-1458-451e-9c2e-59da2cca031a.png)

it was more or less something like this, now this is some code that Im confident showing, thats all, didnt want to led you to think I did not
correct the awful code left in there.

#### Panel with other sketches on the database

What I made here is that, on the database, I stored the user informatio plus every single sketch they've created, 
so I just simply made a get function to retrieve those sketches, so the panel actually is not a list of sketches, is a list
of the particular user sketches, which I found more fitting. You dont get to see every sketch, you get to see the ones you made.

#### REST API

I used the realtime database from firebase, making some get, put and post functions to interact with it.

#### Ability to save sketches

As I said before, I simply saved the canvas image using the .toDataURL method and store that data into the users array of sketches.

#### Live colaboration feature for multiple users

This one was though, I spent the whole weekend learning Socket.IO for this, basically made a server with express in which 
I made a connection with a socket where the user will connect and stream "events" that I've set up.

The idea is: 
 - user emits the "connected" event
 - server recieves that connection and sends the current canvas image for the user to see
 - the user in some momment interacts with the canvas by drawing, on the end of that drawing interaction a "finished drawing" event is sent to the socket + the image resulting on that draw
 - the server recieves that and streams that image to every other user connected to the server
 - the other users recieve that image and sets them on their canvas, so they can see that interaction
 - in case the user clears the canvas, a similar event is sent, in which the "clear canvas" event is sent to every user
 - the user recieves that event and procedes to run the clear canvas function
 
 #### Give each unique user a unique color

 Having the list of colaborators and an array of colors, I simply looked for the current user on that list, and depending on the index in which the user fell, the user got assigned the color 
 that had the same index on the colors array. Then I passed that color to the custom hook in charge of the drawing action.
 
 #### Add a little extra and add a sketches preview pag
 
 I felt that an extra step was needed and added a simple page showing every sketch from an user and a quick preview, and also added a Add New Sketch button to it.
 

