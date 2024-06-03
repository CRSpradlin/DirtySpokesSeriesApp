# **ARCHIVED JUNE 2024:**
## This project was archived and moved to leverage the new [gcp-react-template](https://github.com/CRSpradlin/gcp-react-template). Check out the new and improved [dirty-spokes-series-app repo](https://github.com/CRSpradlin/dirty-spokes-series-app)!

---

# DirtySpokesSeriesApp
This app is the source code for a project dedicated to automating series winner determination of the North Georgia Dirty Spokes trail races. 

## Setup
The prep and setup for this project will be done in phases. In an attempt to keep all the changes made to this project, a larger up-lift was done to ensure source control and local machine env. Development setup will be done in the following phases.

### Phase I:
[Documentation for Setting Up Local AppScript Development](https://developers.google.com/apps-script/guides/clasp)
[Advanced Clasp Docs](https://github.com/google/clasp/blob/master/docs/README.md)
 - Setup GCP in order to hook into running functions locally
 - Add in bundler to build all `*.ts` files properly

 Application deployment heavily influenced by [enuchi/React-Google-Apps-Script](https://github.com/enuchi/React-Google-Apps-Script)

### Phase II:
[Example of Google AppScript with Web Form to Upload Files to Folder](https://www.bpwebs.com/upload-files-to-google-drive-with-google-apps-script/)
- Keep a close eye on the "myFile" name attribute in the input element for the file upload. This name is used within the Google AppScript ".gs" file upload handler function when referencing the file as a blob before uploading to Google Drive.
