# PoE - Heistress

***This product isn't affiliated with or endorsed by Grinding Gear Games in any way.***

Heistress will run in the tray and windows can be hidden/shown by right clicking the tray icon and selecting the assocated window name.

It contains two main features
- Tracking - If you are running heist and want to track how long runs take and/or how valuable certain loot rooms are.
- Pricing - If you want to price the curio loot via optical character recognition OCR and `poe.ninja`.

## Installing

See the releases.

# Tracking Window
One of the main features of Heistress is aiding in the tracking of heist contract/blueprint running. It can watch your `Client.txt` for events like entering/leaving heist areas and rogue dialog to track your progress.

Also it can pull your inventory at the start and end of a heist and produce a summary of your loot so you can estimate what reward rooms are worth.

The screen looks as follows and when active will remain on the top.

***Note***: Moving the window can be accomplished by clicking and holding on a section of the window which is not occupied, the top right corner for instance.

![image](poe-heistress/docs/Tracker.png)

## Contract/Blueprint

The contract/blueprint line tracks which contract/blueprint you are currently running. It is triggered off the name of the area you joined. Upon triggering it will show which damage types this area is noteworthy for (physical, cold, and fire here), decrease the transparency of the jobs which can spawn in the area (lockpicking, perception, agility, demolition, and trap disarmament here), and start the timer.

***Note***: There is no difference in the area name of blueprints/contracts haveing more than 1 rogue auto sets the blueprint flag or the blueprint flag can be togged on/off with the blueprint toggle.

***Note***: It only triggers on the higher level contract/blueprints.

## Timer

The timer shows 3 times, this is completely automated.

- *Main* The first and largest timer is the current elapse time in the heist. This is automatically triggered upon enering the heist.
- **Grab** Is the time until you grab the target. This is automatically triggered by rogue line.
- **Complete** The time from grab to exiting the heist.

***Note***: Tullina does not use her voice lines upon grabbling the target so the timer will not toggle.

***Note***: Blueprint wings are all techincally in the same area. If you want to track per wing you must leave the area.

## Rogues

This shows the currently tracked rogues. This is relevant if you are trying to determine loot drop rates as Vinderi can double contents and each rogue may have different gear. The rogues should be auto detected as you run based on their lines from combat or tasks. If they don't they can be manually toggled by simply clicking on their name. Currently tracked rogues are shown in red. More than 1 rogue auto triggers the blueprint flag which can be manually toggled by clicking on the `Blueprint` toggle text.

## Jobs

The job or jobs, in the case of a blueprint, are shown. Unselected jobs are shown in grayscale seleced in color (lockpicking, perception, demolition here). Jobs which *shouldn't* spawn in the current area are substantially transparent but **can** be toggled. If the rogue/rogues have a line which indicates a certain job it will automatically enabled **but** some rogue/job combos have no voice lines. Flagging a job ungrayscales the associated loot chests.

***Note***: Some rogue/jobs generate no voice lines and will not be auto detected.

## Rewards

To track how many of each reward chest you opened on a given run your can click on the given reward type, which increments the counter in the bottom right of each reward.

***Note***: Alt clicking decrements the given reward count.

***Note***: The bottom right *chest* icon is to indicate small chests/safes. Otherwise the icons should match.

## Run Log JSON

Upon completion the tool logs the run and loot in a JSON file.
This file contains the information on the run which should be mostly readable.

***Note***: The next available sequence number is used, upon restarting the app it checks from 0 up so a deleting a file will make its sequence number available again.

## Settings

Most settings require restarting the application.

 - Use tracker, `use_tracker` - Enabled by default, disable to prevent the tracking window from starting.
 - Client.txt Location, `client_txt` - The location of your `Client.txt`.
 - Track Loot/Rewards, `tracker_trackloot` - Enabled by default, disable turn off the Rogues, Jobs, and Reward sections.
 - Account Name, `account_name` - This is also called your profile name on GGG's main site.
 - Character Name, `character` - Used to pull you characters inventory, your character's name.
 - POESESSID `poesessid` - Your POE SESSID cookie used to grab your characters inventory.
 - Run Save Location `dump_location` - A location to store your heist's run logs.
 - Tracker Window Height `tracker_height` - The height of the tracking window.
 - Tracker Window Width `tracker_width` - The width of the tracking window.
 - Tracker Always Ontop `tracker_ontop` - Enabled by  default, forces the tracker window to be ontop.

Also required

 - League `league` - Used to grab your character' inventory.

# Pricing Window

The pricing window can be triggered with its shortcut key, `Ctrl+U` by default, and toggles between two states, screen grab and pricing.
The screen grab is where you can select the name of the object you want to price and the pricing screen shows you the pricing information.

## Screen Grab

When the shortcut key is pressed the tool captures a full resolution screen grab. It will display a smaller render of the screen and you can select the text by clicking and dragging a rectangle around the text in question.

![image](poe-heistress/docs/GrabScreen.png)

## Pricing

After selecting the text the selected image will be shown along with the OCR text. The text will be all upper case and have no spaces.

![image](poe-heistress/docs/PriceScreen.png)

***Note***: You can price gems, replica uniques, and heist exclusive item bases.

***Note***: The price information for gems is especially questionable some times because there are so many versions of the same gem at different levels and qualities.

## Settings

Most settings require restarting the application.

 - Use Pricer, `use_pricer` - Enabled by default, disable to prevent the pricer window from starting.
 - Pricer Shortcut, `pricer_shortcut` - The shortcut key to trigger an OCR pricing request, `Ctrl+U` by default.
 - Dump Image, `dump_image` - Disabled by default, if enabled will save the full screen grab, sub-selection, and sub-selection coordinates to the save location, Run Save Location `dump_location`.
 - Price Interval, `price_interval` - How often to fetch price information, in seconds.

Also required
 - League `league` - Used when fetching prices from PoE Ninja.

# Settings Window

Settings can be reached with the settings window or available in a json file in your application path.

***Note***: Your POESESSID is saved as an encrypted string via [Electron Safe Storage](https://www.electronjs.org/docs/latest/api/safe-storage) and can only be entered on the settings screen.

# FAQ

# License

[GNU LESSER GENERAL PUBLIC LICENSE v3.0](LICENSE.md)