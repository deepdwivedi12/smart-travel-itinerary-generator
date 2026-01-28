# Smart Travel Itinerary Generator

## Project Description
Smart Travel Itinerary Generator is an AI-assisted frontend and automation project that helps users generate a personalized, day-wise travel itinerary. Users provide trip details through a web form, and the itinerary is automatically generated using AI and delivered to their email.

This project demonstrates the integration of frontend development with no-code automation workflows using n8n and AI responsibly as a co-pilot.

---

## Project Option
Project Option 1 – Travel Itinerary Generator

---

## Tech Stack
- HTML
- CSS
- JavaScript
- Cursor AI (used as a co-pilot for frontend development)
- n8n (Automation workflow)
- OpenAI (LLM node inside n8n)
- GitHub Pages (Hosting)

---

## Architecture Overview
User → Frontend Web Form → n8n Webhook → AI (LLM) → Email Service → User

---

## Frontend Features
- Responsive UI built using HTML, CSS, and JavaScript
- Collects the following user inputs:
  - Destination
  - Number of days
  - Budget
  - Mode of travel
  - Number of travelers
  - Email address
  - Additional preferences (optional)
- Client-side input validation
- Clear submission feedback

---

## Automation Workflow (n8n)
- Receives data from frontend using a Webhook node
- Sends structured input to an LLM node for itinerary generation
- Formats the AI response into a readable structure
- Sends the generated itinerary to the user via email

The exported n8n workflow JSON file is included in this repository.

---

## AI Usage Documentation
- Cursor AI was used as a co-pilot to assist with UI design, layout improvements, CSS refinements, and JavaScript logic.
- OpenAI LLM was used inside the n8n workflow to generate personalized travel itineraries.
- All design decisions, workflow structure, and logic implementation were done manually by the developer.

---

## Live Project URL
https://deepdwivedi12.github.io/smart-travel-itinerary-generator/

---

## GitHub Repository
https://github.com/deepdwivedi12/smart-travel-itinerary-generator

---

## Limitations and Assumptions
- Requires an active n8n instance to process automation
- Email delivery depends on correct email service configuration
- AI-generated itineraries are informational and may vary based on input quality

---

## Author
Deep Dwivedi
