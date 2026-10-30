---
name: cover-letter-writer
description: Write a tailored English cover letter from a job description, using simple and correct English, light company research, and the candidate profile. Use this skill when the user provides a vacancy, job post, company name, or asks for a human-sounding cover letter for a specific role.
---

# Cover Letter Writer

## Overview

Use this skill to write a tailored cover letter in English based on:

1. the job description
2. the candidate profile
3. basic company research
4. the user's preferred tone and constraints

Use this skill for drafting and tailoring the letter content.
If the final deliverable must be PDF only, hand off the final text to `cover-letter-pdf-generator`.

## Goal

Write a cover letter that sounds natural, confident, personal, and human.
The letter must not sound robotic, too formal, too complex, or generic.

The writing style must be:

- clear
- grammatically correct
- simple English
- direct
- warm but professional
- realistic and believable

The candidate should sound like:

- an experienced developer
- someone who likes growth and meaningful projects
- someone who is ready for challenges
- someone who solves difficult problems
- someone who can take ownership and deliver results

Do not use advanced academic English.
Do not use heavy corporate language.
Do not use exaggerated praise.
Do not make the text sound fake.

## Workflow

1. Read the job description carefully.
2. Extract the role title, seniority, tech stack, product or domain, expected responsibilities, soft skills, business context, and anything especially important.
3. Research the company lightly before writing.
4. Identify what the company does, what kind of product or business area it has, and what may be interesting about its mission, product, team, or technical challenges.
5. Use company research carefully. Mention only details that are likely true and relevant.
6. Match the candidate profile to the vacancy using real strengths, relevant experience, ownership, problem-solving ability, motivation, product mindset, and growth potential.
7. Keep the language simple, direct, and natural.
8. Keep the letter human, confident, and believable.
9. If the project requires PDF-only cover letters, store the final letter content in structured package data and pass it to `cover-letter-pdf-generator`.

## Core Rules

### Read the Job Description Carefully

Extract:

- role title
- seniority
- tech stack
- product or domain
- expected responsibilities
- soft skills
- business context
- anything especially important

### Research the Company

Before writing, identify:

- what the company does
- product or business area
- likely engineering environment
- what may be interesting about their mission, product, team, or technical challenges

Use research carefully.
Only mention details that are likely true and relevant.
Do not invent facts.
If the information is unclear, keep it general and safe.

### Match the Candidate to the Vacancy

Use the candidate profile to connect:

- real technical strengths
- relevant domain experience
- ownership
- problem-solving ability
- motivation
- product mindset
- interest in growth

Highlight alignment with the vacancy.
Do not claim experience the candidate does not have.

### Keep the Language Simple

Target level:

- natural professional English
- not complex
- not legal
- not academic
- not full of buzzwords

Prefer short and medium-length sentences.
Avoid long overloaded paragraphs.

### Keep It Human

The letter must feel like a real person wrote it.
It should include genuine motivation.
It should not read like a template copied from the internet.

### Keep Confidence Strong but Believable

The candidate may say that he:

- is ready for difficult challenges
- enjoys solving complex problems
- can take responsibility
- can deliver strong results
- is experienced and reliable

Do not make impossible claims such as:

- I can solve every problem
- I am the best engineer
- I guarantee success

Rewrite such ideas into credible professional statements.

## Required Tone

Use this tone by default:

- confident
- positive
- grounded
- motivated
- human
- not too formal

The candidate should sound like someone who says:

- I want to grow.
- I want to build interesting products.
- I am ready for challenges.
- I like solving hard problems.
- I can take ownership and deliver.
- I am an experienced developer and I learn fast.

## What to Emphasize

When relevant, emphasize these themes:

- strong development experience
- ability to solve complex problems
- ownership and responsibility
- interest in building useful and interesting products
- motivation to grow
- willingness to take on challenges
- ability to adapt
- product and engineering mindset
- collaboration and contribution to the team

## English Constraints

The output must be in English.

The English must be:

- grammatically correct
- simple
- clear
- professional
- not too advanced

Avoid:

- overly complex vocabulary
- old-fashioned phrases
- `To whom it may concern` unless necessary
- generic filler
- cliches
- empty motivation statements

## Structure

Default structure:

1. Greeting
2. Short opening with role name and why the candidate is interested
3. One paragraph about relevant experience and strengths
4. One paragraph connecting the candidate to the company, product, or team
5. Short closing with interest in discussion

## Length

Target:

- standard: 220 to 320 words

Possible variants:

- short: 150 to 200 words
- standard: 220 to 320 words
- detailed: 320 to 420 words

Default to standard unless the user asks otherwise.

## Output Format

When the user asks for a cover letter, return:

- `Final cover letter`: the polished English version
- `Quick notes`: a short note on why it fits the role, what was emphasized from the job description, and what company angle was used

Keep notes brief.

If the project requires final PDF-only letters:

- return the final English letter content
- return the Russian meaning-check version if required by project rules
- pass both into the package data for `cover-letter-pdf-generator`

## Personalization Instructions for This Candidate

Important personal positioning:

- The candidate is an experienced developer.
- He is ready for challenges and complex tasks.
- He wants to grow as an engineer.
- He wants to build interesting and useful projects.
- He can solve difficult technical problems and take ownership.
- He should sound confident but realistic.
- His English should stay simple and natural.

Use phrases similar in meaning to:

- I am interested in growing in this role.
- I enjoy building useful products and solving real problems.
- I am ready for challenging tasks.
- I can take responsibility and deliver strong work.
- I would be glad to contribute my experience and continue growing with your team.

Do not repeat these lines mechanically.
Rewrite naturally for each role.

## Project-Specific Rules

- Never use the em dash character (U+2014).
- The main cover letter version is in English.
- When project rules require review support, also create a separate Russian meaning-check version.
- Final cover letter deliverables in this project should be PDF only, generated through `cover-letter-pdf-generator`.

## Safety and Honesty

Do not invent:

- company facts
- team structure
- achievements
- years of experience
- technologies not supported by the candidate profile

If something is uncertain, keep it broad and true.

## Editing Mode

If the user provides a draft, improve it by:

- simplifying English
- correcting grammar
- making it more human
- making it more tailored to the vacancy
- removing robotic phrasing
- strengthening motivation and clarity

## Trigger Phrases

This skill should activate for prompts like:

- write a cover letter for this vacancy
- create a cover letter from this job description
- make this sound more human
- tailor my cover letter to this company
- write a simple English cover letter
- use my CV and this vacancy
- make it less robotic and more personal
