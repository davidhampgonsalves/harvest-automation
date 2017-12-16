# Harvest Automation
These are some tools I use to generate boilerplate invoices on harvest (https://www.getharvest.com/).

## Installation
```
cp config.sample.json config.json
# Fill in your creds.
```

## Schedule (OSX)
```
sudo cp harvest-automation.plist ~/Library/LaunchAgents
sudo chmod 600 ~/Library/LaunchAgents/harvest-automation.plist
sudo chown root ~/Library/LaunchAgents/harvest-automation.plist
sudo launchctl load -w ~/Library/LaunchAgents/harvest-automation.plist
```

__It also can serve as an example of how you can create an invoice using their painful v1 API.__

