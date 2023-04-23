# PerformanceTesting_on_PCUKchatbotchatbot

## Content
- Load testing Report
- Summary
- Introduction
- Install
- Prerequisites
- Elements of a Minimal Test Plan
- Test Plan
- Collection of API
- List of API
- Load the JMeter Script
- Make jtl File
- Make html File
- HTML Report

# Introduction
This document explains how to run a performance test with JMeter against an OpenCart E-commerce Site.

# Install
Java
https://www.oracle.com/java/technologies/downloads/

JMeter
https://jmeter.apache.org/download_jmeter.cgi


## We use BlazeMeter to generate JMX files
https://chrome.google.com/webstore/detail/blazemeter-the-continuous/mbopgmdnpcbohhpnfglgohlbhfongabi?hl=en

# Prerequisites
- As of JMeter 4.0, Java 8 and above are supported.
- Memory 16GB RAM is a good value.

# Elements of a minimal test plan
- Thread Group

  The root element of every test plan. Simulates the (concurrent) users and then run all requests. Each thread simulates a single user.

- HTTP Request Default (Configuration Element)

- HTTP Request (Sampler)

- Summary Report (Listener)

# Test Plan
  Testplan > Add > Threads (Users) > Thread Group (this might vary dependent on the jMeter version you are using)

- Name: Users

- Number of Threads (users): 200 to 500

- Ramp-Up Period (in seconds): 10

- Loop Count: 1

# Collection of API
- Run BlazeMeter

- Collect Frequently used API

- Save JMX file then paste => apache-jmeter-5.5\bin

# Load the JMeter Script
- File > Open (CTRL + O)
- Locate the "Prostate-cancer-uk400.jmx" file contained on this repo
- provide thread and ramp up period
- The Test Plan will be loaded

# Test execution (from the Terminal)
- JMeter should be initialized in non-GUI mode.
- Make a report folder in the bin folder.
- Run Command in jmeter\bin folder.
