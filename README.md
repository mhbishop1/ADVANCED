AI & Student Conflict: Social Media Research Orchestrator
This repository contains an automated Data Orchestration & Analytics tool designed to investigate the impact of Artificial Intelligence on interpersonal and academic disagreements among college students.

📌 Project Overview
Our research leverages automated scraping across three major social media platforms (TikTok, Reddit, and X) to collect and analyze 1,000+ data points. The orchestrator doesn't just collect data; it performs real-time Natural Language Processing (NLP) to categorize the emotional context of student discussions.

🛠️ Technical Workflow
1. Multi-Source Orchestration
The script acts as a central "Manager," triggering four specialized scraping bots simultaneously:

TikTok: Captures visual/social trends and "story-time" conflict videos.

Reddit: Deep-dives into long-form first-person accounts and community debates.

X (Twitter): Monitors real-time reactions and academic policy discussions.

2. Intelligent Data Processing
As the data is pulled from the cloud, the orchestrator applies several cleaning and analysis rules:

Lexicon Sentiment Analysis: Uses the sentiment library to assign a numerical score to each post, categorizing the "mood" as Positive, Negative, or Neutral.

Academic Integrity Flagging: Automatically scans for "high-conflict" keywords (e.g., Turnitin, Expelled, Honor Code) to highlight posts relevant to university policy disagreements.

Data Normalization: Unifies messy, platform-specific data into a single consistent schema (User, Content, Engagement, Sentiment, URL).

Automated Deduplication: Ensures that the final dataset contains only unique entries by comparing URL "fingerprints."

📊 Data Cleaning Strategy (Compliance)
Following the research requirements, the script executes the following cleaning rules:

Anonymization: Scrubbing identifying metadata to maintain data source privacy.

Noise Reduction: Filtering out non-English content and promotional/spam posts.

Consistency: Standardizing text by removing line breaks and special characters that interfere with CSV analysis.

🚀 How to Run
Clone the Repository and ensure Node.js is installed.

Install Dependencies:

Bash
npm install apify-client sentiment
Set Your API Token: Provide your Apify Personal API Token in the INPUT_SCHEMA or as an environment variable.

Execute:

Bash
node main.js
📝 Research Question
“How does the use of AI impact disagreements/arguments among college students?”

This tool provides the raw evidence needed to answer this by quantifying the sentiment and frequency of AI-related conflicts across the digital student landscape.
