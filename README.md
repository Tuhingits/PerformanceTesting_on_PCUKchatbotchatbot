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

# Load testing Report

| Concurrent Request  | Loop Count | Avg TPS for Total Samples  | Error Rate | Total Concurrent API request |
|               :---: |      :---: |                      :---: |                        :---: |      :---: |
| 290 | 1 |  10 | .47%    | 72474  |
| 350 | 1 |  10 | .59%    | 89600  |
| 375 | 1 |  10 | 1.41%   | 96000  |

# Summary
- While executed 350 concurrent request, found 530 request got connection timeout and error rate is 0.59%.
- Server can handle almost concurrent 89600 API call with almost less than 1% error rate.

# Introduction
This document explains how to run a performance test with JMeter against an OpenCart E-commerce Site.

# Install
Java
https://www.oracle.com/java/technologies/downloads/

JMeter
https://jmeter.apache.org/download_jmeter.cgi


## Using BlazeMeter to generate JMX files
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

![jmeter](https://user-images.githubusercontent.com/44814788/233927871-b302d077-03ab-4feb-96b9-28ff79308634.JPG)


# Test execution (from the Terminal)
- JMeter should be initialized in non-GUI mode.
- Make a report folder in the bin folder.
- Run Command in jmeter\bin folder.

# Make jtl file from jmx file
  command : jmeter -n -t Prostate-cancer-uk400.jmx -l Report\prostatecancerT375.j
  
  ![341178877_1026838331630852_5234187232119471700_n](https://user-images.githubusercontent.com/44814788/233928865-b17e9220-8df8-4346-8224-614d9b675d00.png)
  
  # Make html Report file
  command : jmeter -g Report\prostatecancerT375.jtl -o Report\prostatecancerT375.html
  
  ![html](https://user-images.githubusercontent.com/44814788/233930014-150581ef-9008-4de8-916e-a4c0025009bd.JPG)
  
  # HTML Report
  
  ![report](https://user-images.githubusercontent.com/44814788/233930788-7594d4c0-14de-4bb9-ba57-ded5a22e7fb1.JPG)

