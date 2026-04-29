# Final Project Proposal 

## 1. Project Overview 
This project is a web-based application inspired by ArtFight, designed to create an interactive and engaging space for digital artists to share their work, collaborate, and find creative inspiration. The application aims to replicate the core experience of an art “attack” game, where users create artwork featuring other users’ characters, while also adding new features that enhance creativity and accessibility.
The primary problem this project addresses is that many artists struggle with creative blocks and lack structured, engaging ways to interact with other artists online. While existing platforms allow users to post artwork, they often do not actively encourage collaboration or provide tools for generating inspiration. This application seeks to solve that by combining social interaction with built-in inspiration tools, creating a more dynamic and motivating environment for artists.
The target users are digital artists, hobbyists, and students who enjoy character design, drawing, and participating in online art communities. The platform is especially suited for users who want to improve their skills, engage with others, and participate in creative challenges.
The core user experience revolves around three main features:
User Profiles and Character Pages: Users can create accounts, upload their original characters, and showcase their artwork.
Attack System: Users can “attack” another user by creating artwork of their character, which is then submitted and displayed on the platform, encouraging interaction and friendly competition.
Inspiration Generator: Users can access a built-in feature that pulls images from public APIs (Unsplash or Pixabay) to help generate ideas for poses, backgrounds, and themes.
By combining social features with creative tools, the project aims to deliver a platform that not only showcases artwork but actively helps users create it.


## 2. Planned Features and Tasks 
### Frontend - React
Here are the main views I will create using react
Home Feed (recent attacks and activity)
User Profile Page
Character Page
Attack Submission Page
Inspiration Generator Component
Authentication (Login/Register)
Some reusable components I will create
Navbar 
Cards 
Forms 
Implement inspiration feature using APIs like Unsplash or Pixabay
### Backend - Express
I will have endpoints for
User authentication (api/register, api/login)
Users (users/id)
Characters (user/id/characters, characters, characters/id)
Attacks (users/id/attacks)
Inspiration
Key tasks
Set up Express server and middleware
Implement RESTful API structure
Connect to SQL database
Implement authentication (sessions)
Handle image uploads (store locally or via Cloudinary)
Validate incoming data (e.g., required fields)
Handle errors and return proper JSON responses
Integrate external API calls for inspiration feature
Secure routes (protect authenticated endpoints)


## 3. Scope and Complexity 
I believe my project idea is a strong balance between applying the knowledge I have gained from past assignments and expanding my skills by learning new technologies. The project builds on my experience from past assignments, while introducing new challenges. Additionally, the project is flexible in scope, with many opportunities to expand functionality and improve features over time. This allows me to meet the required workload while also having the potential to exceed it by implementing additional features or improving the overall user experience if time permits.

Core Features (Must-Have)
These features are essential to meet the project goals:
- [x] User authentication (registration and login)
- [x] User profiles and character creation
- [x] Attack submission system (including image upload via URL)
- [x] Display of attacks and user interactions
- [x] Basic inspiration generator using an external API

Stretch Goals (Nice-to-Have)
If time permits, the following features will enhance the project:
- [ ] Commenting or liking system on attacks
- [ ] Bookmarked characters to attack later
- [ ] Team-based system (e.g., grouping users into sides)
- [ ] Advanced filtering or search functionality
- [ ] Improved UI/UX polish and responsiveness
- [ ] More advanced inspiration tools (e.g., combined search filters or random generators)


## 4. New Knowledge and Open Questions
### Uploading and storing images
Research about uploading images and storing them efficiently
Start with local uploads (/uploads folder) 
Once I get this working upgrade to Cloudinary (free version of course) and storing a link to the image in the SQL database.
### API Integration:
The inspiration feature will require integrating external APIs. I will need to understand how to securely manage API keys, handle rate limits, and process third-party JSON responses in my backend.
Risks
### Image Upload Complexity:
 Handling file uploads correctly (file size limits, formats, storage, and retrieval) may be more complex than expected. There is also a risk of bugs when connecting frontend uploads to backend processing and cloud storage.
### API Limits and Reliability:
 External APIs like Unsplash may have rate limits or usage restrictions, which could affect the inspiration feature if not handled properly.
### Performance Concerns:
 Since the application involves many images, there may be performance issues related to loading times or large data transfers, especially if images are not optimized.
Time management
Some parts of the project may take longer than expected and slow me down.
