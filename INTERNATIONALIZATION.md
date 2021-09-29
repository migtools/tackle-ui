# Internationalization

## How to add a new language

To translate Tackle UI into a new language you only need to create a new folder in `public/locales/`. The name of the folder must be the Language code. For instance:

| Language | Folder name |
| -------- | ----------- |
| English  | en          |
| Spanish  | es          |
| German   | de          |

The folder `public/locales/{myLanguageCode}` must contain a file `translation.json` whose content corresponds to the new language to be translated.

> As soon as you feel confident, please open a new Pull Request with your changes and make it part of the official repository.

## How to see the new translation in action?

To see your changes in action you will need to start Tackle UI in development mode. For starting Tackle UI in development mode please follow the instruction at [Starting the UI](https://github.com/konveyor/tackle-ui#starting-the-ui)

Steps:

- Start Tackle UI in dev mode following [Starting the UI](https://github.com/konveyor/tackle-ui#starting-the-ui) instructions.
- Go to Keycloak http://localhost:8180/auth/admin/ and use `username=admin, password=admin`. Go to `Realm settings > themes > Supported locales` and select the new language you are adding. Finally click on `Save`.
- Go to http://localhost:3000/ and you should be redirected to the Login page where you are able to select your new language.

At this point you should be able to see your new language already translated into the language you selected in the Login phase.

> Remember that since you are in dev mode any change you do to the folder `public/locales` should be automatically loaded in your browser.

## Why the questionnaire (assessment process) is not translated?

The questionnaire is data comming from https://github.com/konveyor/tackle-pathfinder hence the translation to a new language of the questionnaire should be done in that repository.
